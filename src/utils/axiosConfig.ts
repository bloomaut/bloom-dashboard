import axios from "axios";

const CSRF_COOKIE_CANDIDATES = ["__Host-csrfToken", "csrfToken", "XSRF-TOKEN"];

function normalizeApiBase(input: string) {
  const trimmed = input.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed.slice(0, -4) : trimmed;
}

const apiBase = process.env.NEXT_PUBLIC_API_DASH;
if (apiBase) axios.defaults.baseURL = normalizeApiBase(apiBase);

export function getCookieValue(name: string, cookieString?: string): string | null {
  const source = cookieString ?? (typeof document !== "undefined" ? document.cookie : "");
  if (!source) return null;

  const parts = source.split(";").map(v => v.trim());
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = part.slice(0, eq);
    if (k !== name) continue;
    const v = part.slice(eq + 1);
    return decodeURIComponent(v);
  }
  return null;
}

export function getCsrfTokenFromCookies(cookieString?: string): string | null {
  for (const name of CSRF_COOKIE_CANDIDATES) {
    const v = getCookieValue(name, cookieString);
    if (v) return v;
  }
  return null;
}

let csrfTokenCache: string | null = null;
let csrfTokenPromise: Promise<string | null> | null = null;

function getApiDashBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_API_DASH;
  if (fromEnv) return normalizeApiBase(fromEnv);
  const fromAxios = typeof axios.defaults.baseURL === "string" ? axios.defaults.baseURL : "";
  return fromAxios ? normalizeApiBase(fromAxios) : "";
}

async function fetchCsrfTokenFromBackend(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (typeof fetch !== "function") return null;
  const base = getApiDashBaseUrl();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/api/auth/csrf`, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-client-type": "web",
      },
    });
    const data = (await res.json().catch(() => null)) as {
      csrfToken?: string | null;
      csrf_token?: string | null;
    } | null;
    const token = data?.csrfToken ?? data?.csrf_token ?? null;
    return token && typeof token === "string" ? token : null;
  } catch {
    return null;
  }
}

async function resolveCsrfToken(): Promise<string | null> {
  if (csrfTokenCache) return csrfTokenCache;

  const fromCookies = getCsrfTokenFromCookies();
  if (fromCookies) {
    csrfTokenCache = fromCookies;
    return fromCookies;
  }

  if (!csrfTokenPromise) {
    console.debug("Resolving CSRF token from backend");
    csrfTokenPromise = (async () => {
      const token = await fetchCsrfTokenFromBackend();
      csrfTokenCache = token;
      csrfTokenPromise = null;
      return token;
    })();
  }

  return csrfTokenPromise;
}

function setHeader(config: any, key: string, value: string) {
  if (!config.headers) config.headers = {};
  const headers = config.headers;
  if (typeof headers.set === "function") {
    headers.set(key, value);
  } else {
    headers[key] = value;
  }
}

async function tryRefreshSession(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (typeof fetch !== "function") return false;
  const base = getApiDashBaseUrl();
  if (!base) return false;

  try {
    const res = await fetch(`${base}/api/user/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-client-type": "web",
        "X-Client-Type": "web",
        "client-type": "web",
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

axios.interceptors.request.use(async config => {
  config.withCredentials = true;
  setHeader(config, "x-client-type", "web");
  setHeader(config, "X-Client-Type", "web");
  setHeader(config, "client-type", "web");

  if (typeof window !== "undefined") {
    let clientId = localStorage.getItem("client_id");
    if (!clientId) {
      const uuid =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `cid_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
      clientId = uuid;
      localStorage.setItem("client_id", clientId);
    }
    if (clientId) setHeader(config, "X-Client-ID", clientId);
  }

  const method = String(config.method || "get").toUpperCase();
  if (method !== "GET") {
    const csrf = await resolveCsrfToken();
    if (!csrf) throw new Error("Missing CSRF token");
    setHeader(config, "x-csrf-token", csrf);
  }

  return config;
});

axios.interceptors.response.use(
  response => response,
  async error => {
    const status = error?.response?.status;
    const config = error?.config as any;
    const url = String(config?.url || "");

    const is401 = status === 401;
    const alreadyRetried = Boolean(config?.__bloomRetried);
    const isAuthOrMe =
      url.includes("/api/auth/") ||
      url.includes("/api/user/me") ||
      url.includes("/api/auth/csrf") ||
      url.includes("/auth/csrf");

    if (is401 && config && !alreadyRetried && !isAuthOrMe) {
      config.__bloomRetried = true;
      const refreshed = await tryRefreshSession();
      if (refreshed) return axios(config);
    }

    return Promise.reject(error);
  },
);

export default axios;
