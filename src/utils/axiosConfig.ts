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

function setHeader(config: any, key: string, value: string) {
  if (!config.headers) config.headers = {};
  const headers = config.headers;
  if (typeof headers.set === "function") {
    headers.set(key, value);
  } else {
    headers[key] = value;
  }
}

axios.interceptors.request.use(async config => {
  config.withCredentials = true;
  setHeader(config, "x-client-type", "web");

  if (typeof window !== "undefined") {
    const clientId = localStorage.getItem("client_id");
    if (clientId) setHeader(config, "X-Client-ID", clientId);
  }

  const method = String(config.method || "get").toUpperCase();
  if (method !== "GET") {
    const csrf = getCsrfTokenFromCookies();
    if (!csrf) throw new Error("Missing CSRF token");
    setHeader(config, "x-csrf-token", csrf);
  }

  return config;
});

export default axios;
