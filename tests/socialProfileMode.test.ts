import { describe, expect, it } from "vitest";
import { resolveSocialMediaView } from "@/features/(dashboard)/Social/utils/socialProfileMode";

describe("resolveSocialMediaView", () => {
  it("cuando disableSocialProfile=true siempre devuelve dashboard", () => {
    const view = resolveSocialMediaView({
      disableSocialProfile: true,
      profile: null,
      isProfileConnected: false,
    });
    expect(view).toBe("dashboard");
  });

  it("cuando está habilitado y no hay conexión devuelve setup", () => {
    const view = resolveSocialMediaView({
      disableSocialProfile: false,
      profile: {
        _id: "1",
        clientId: "c",
        username: "u",
        bio: "",
        avatar: "",
        socialMedia: "tiktok",
        createdAt: "",
        updatedAt: "",
        connected: false,
      },
      isProfileConnected: false,
    });
    expect(view).toBe("setup");
  });

  it("cuando está habilitado y hay conexión devuelve dashboard", () => {
    const view = resolveSocialMediaView({
      disableSocialProfile: false,
      profile: {
        _id: "1",
        clientId: "c",
        username: "u",
        bio: "",
        avatar: "",
        socialMedia: "tiktok",
        createdAt: "",
        updatedAt: "",
        connected: true,
      },
      isProfileConnected: true,
    });
    expect(view).toBe("dashboard");
  });
});
