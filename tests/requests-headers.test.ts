import { describe, expect, it, vi, beforeEach } from "vitest";

import axios from "@/utils/axiosConfig";
import { getQuest, postQuest, patchUserProfile, patchUserStatus } from "@/services/fetch";
import {
  createSocialMediaContentFromIdea,
  createSocialMediaIdea,
  transcribeSocialMediaUpload,
} from "@/features/(dashboard)/Social/services/socialMediaService";

function setBrowserGlobals(cookie: string) {
  (globalThis as any).window = {};
  (globalThis as any).document = { cookie };
  (globalThis as any).localStorage = {
    getItem: vi.fn(() => null),
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
  setBrowserGlobals("");
  process.env.NEXT_PUBLIC_API_DASH = "https://api.example";
});

describe("Axios interceptors", () => {
  it("siempre adjunta withCredentials y x-client-type", async () => {
    let seenConfig: any = null;
    axios.defaults.adapter = async (config: any) => {
      seenConfig = config;
      return { data: { ok: true }, status: 200, statusText: "OK", headers: {}, config };
    };

    await axios.get("/api/ping");

    expect(seenConfig.withCredentials).toBe(true);
    const headers = seenConfig.headers;
    const clientType = typeof headers?.get === "function" ? headers.get("x-client-type") : headers?.["x-client-type"];
    expect(clientType).toBe("web");
  });

  it("en no-GET exige x-csrf-token desde cookie", async () => {
    let seenConfig: any = null;
    axios.defaults.adapter = async (config: any) => {
      seenConfig = config;
      return { data: { ok: true }, status: 200, statusText: "OK", headers: {}, config };
    };

    (globalThis as any).fetch = vi.fn(async () => ({ json: async () => ({ csrfToken: null }) })) as any;
    await expect(axios.post("/api/ping", { a: 1 })).rejects.toThrow(/Missing CSRF token/);

    setBrowserGlobals("csrfToken=token123");
    await axios.post("/api/ping", { a: 1 });

    const headers = seenConfig.headers;
    const csrf = typeof headers?.get === "function" ? headers.get("x-csrf-token") : headers?.["x-csrf-token"];
    expect(csrf).toBe("token123");
  });

  it("en no-GET usa /api/auth/csrf si no hay cookie legible", async () => {
    setBrowserGlobals("");
    process.env.NEXT_PUBLIC_API_DASH = "https://api.example";

    let seenConfig: any = null;
    axios.defaults.adapter = async (config: any) => {
      seenConfig = config;
      return { data: { ok: true }, status: 200, statusText: "OK", headers: {}, config };
    };

    (globalThis as any).fetch = vi.fn(async (url: string, init: any) => {
      expect(url).toBe("https://api.example/api/auth/csrf");
      expect(init.credentials).toBe("include");
      expect(init.headers["x-client-type"]).toBe("web");
      return { json: async () => ({ csrfToken: "token123" }) } as any;
    });

    await axios.post("/api/ping", { a: 1 });

    const headers = seenConfig.headers;
    const csrf = typeof headers?.get === "function" ? headers.get("x-csrf-token") : headers?.["x-csrf-token"];
    expect(csrf).toBe("token123");
  });

  it("patchUserStatus usa PATCH y adjunta x-csrf-token", async () => {
    setBrowserGlobals("csrfToken=token123");
    let seenConfig: any = null;
    axios.defaults.adapter = async (config: any) => {
      seenConfig = config;
      return { data: { ok: true }, status: 200, statusText: "OK", headers: {}, config };
    };

    await patchUserStatus("TERMS_ACCEPTED");

    expect(String(seenConfig.method).toLowerCase()).toBe("patch");
    expect(String(seenConfig.url)).toBe("/api/user/status");
    const headers = seenConfig.headers;
    const csrf = typeof headers?.get === "function" ? headers.get("x-csrf-token") : headers?.["x-csrf-token"];
    expect(csrf).toBe("token123");
  });

  it("patchUserProfile usa PATCH /api/user/profile y adjunta x-csrf-token", async () => {
    setBrowserGlobals("csrfToken=token123");
    let seenConfig: any = null;
    axios.defaults.adapter = async (config: any) => {
      seenConfig = config;
      return { data: { ok: true }, status: 200, statusText: "OK", headers: {}, config };
    };

    await patchUserProfile({ name: "A", lastname: "B", phone: "1" });

    expect(String(seenConfig.method).toLowerCase()).toBe("patch");
    expect(String(seenConfig.url)).toBe("/api/user/profile");
    const headers = seenConfig.headers;
    const csrf = typeof headers?.get === "function" ? headers.get("x-csrf-token") : headers?.["x-csrf-token"];
    expect(csrf).toBe("token123");
    const data = typeof seenConfig.data === "string" ? JSON.parse(seenConfig.data) : seenConfig.data;
    expect(data).toEqual({ name: "A", lastname: "B", phone: "1" });
  });

  it("transcribeSocialMediaUpload usa POST /api/social-media/transcription y adjunta x-csrf-token", async () => {
    setBrowserGlobals("csrfToken=token123");
    let seenConfig: any = null;
    axios.defaults.adapter = async (config: any) => {
      seenConfig = config;
      return { data: { ok: true }, status: 200, statusText: "OK", headers: {}, config };
    };

    await transcribeSocialMediaUpload(new Blob(["x"], { type: "audio/wav" }), {});

    expect(String(seenConfig.method).toLowerCase()).toBe("post");
    expect(String(seenConfig.url)).toBe("/api/social-media/transcription");
    const headers = seenConfig.headers;
    const csrf = typeof headers?.get === "function" ? headers.get("x-csrf-token") : headers?.["x-csrf-token"];
    expect(csrf).toBe("token123");
  });

  it("createSocialMediaIdea usa POST /api/social-media/idea con action create-idea", async () => {
    setBrowserGlobals("csrfToken=token123");
    let seenConfig: any = null;
    axios.defaults.adapter = async (config: any) => {
      seenConfig = config;
      return {
        data: {
          data: {
            statusCode: 201,
            result: { idea: { title: "t", message: "m", proofType: "", intention: "", narrative: "" } },
          },
        },
        status: 201,
        statusText: "Created",
        headers: {},
        config,
      };
    };

    await createSocialMediaIdea({ userId: "u1", idea: "hola" });

    expect(String(seenConfig.method).toLowerCase()).toBe("post");
    expect(String(seenConfig.url)).toBe("/api/social-media/idea");
    const data = typeof seenConfig.data === "string" ? JSON.parse(seenConfig.data) : seenConfig.data;
    expect(data.action).toBe("create-idea");
    expect(data.userId).toBe("u1");
  });

  it("createSocialMediaContentFromIdea usa POST /api/social-media/idea con action create-content", async () => {
    setBrowserGlobals("csrfToken=token123");
    let seenConfig: any = null;
    axios.defaults.adapter = async (config: any) => {
      seenConfig = config;
      return {
        data: { data: { statusCode: 200, result: { idea: "Creating content piece" } } },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    await createSocialMediaContentFromIdea({
      userId: "u1",
      title: "t",
      message: "m",
      proofType: "p",
      intention: "i",
      narrative: "n",
    });

    expect(String(seenConfig.method).toLowerCase()).toBe("post");
    expect(String(seenConfig.url)).toBe("/api/social-media/idea");
    const data = typeof seenConfig.data === "string" ? JSON.parse(seenConfig.data) : seenConfig.data;
    expect(data.action).toBe("create-content");
    expect(data.userId).toBe("u1");
  });
});

describe("fetch() wrappers", () => {
  it("incluye credentials y x-client-type en GET (getQuest) hacia API_DASH", async () => {
    const fetchMock = vi.fn(async (input: any, init: any) => {
      expect(String(input)).toBe("https://api.example/api/quest/1");
      expect(init.method).toBe("GET");
      expect(init.credentials).toBe("include");
      expect(init.headers["x-client-type"]).toBe("web");
      return { ok: true, json: async () => ({ ok: true }) } as any;
    });
    (globalThis as any).fetch = fetchMock;

    await getQuest(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("en no-GET exige x-csrf-token (postQuest)", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ ok: true }) }) as any);
    (globalThis as any).fetch = fetchMock;

    await expect(postQuest({ userId: "u", answers: [], terms: true, completed: true, prop: false })).rejects.toThrow(
      /Missing CSRF token/,
    );

    setBrowserGlobals("csrfToken=token123");

    const fetchMock2 = vi.fn(async (input: any, init: any) => {
      expect(String(input)).toBe("https://api.example/api/quest");
      expect(init.method).toBe("POST");
      expect(init.credentials).toBe("include");
      expect(init.headers["x-client-type"]).toBe("web");
      expect(init.headers["x-csrf-token"]).toBe("token123");
      return { ok: true, json: async () => ({ ok: true }) } as any;
    });
    (globalThis as any).fetch = fetchMock2;

    await postQuest({ userId: "u", answers: [], terms: true, completed: true, prop: false });
    expect(fetchMock2).toHaveBeenCalledTimes(1);
  });
});
