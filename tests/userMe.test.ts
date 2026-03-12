import { describe, expect, it } from "vitest";
import { extractUserFromMeResponse, getRouteForUser } from "@/lib/userMe";
import { IUser } from "@/typescript/interfaces/business.interface";

const baseUser: IUser = {
  id: "1",
  name: "A",
  lastname: null,
  phone: null,
  email: "a@b.com",
  active: true,
  role: "user",
  onboardingStatus: "FIRST_LOGIN",
  wishList: false,
  suscription: "free",
  client: null,
};

describe("extractUserFromMeResponse", () => {
  it("toma user desde result.user", () => {
    const user = extractUserFromMeResponse({ statusCode: 200, result: { user: baseUser } });
    expect(user?.id).toBe("1");
  });

  it("toma user desde user", () => {
    const user = extractUserFromMeResponse({ user: { ...baseUser, id: "2" } });
    expect(user?.id).toBe("2");
  });
});

describe("getRouteForUser", () => {
  it("redirige admin a backoffice", () => {
    const path = getRouteForUser({ ...baseUser, role: "admin" }, "es");
    expect(path).toBe("/es/backoffice/metrics");
  });

  it("redirige wishList a onboarding/wishlist", () => {
    const path = getRouteForUser({ ...baseUser, wishList: true }, "en");
    expect(path).toBe("/en/onboarding/wishlist");
  });

  it("redirige FIRST_LOGIN a terms", () => {
    const path = getRouteForUser({ ...baseUser, onboardingStatus: "FIRST_LOGIN" }, "en");
    expect(path).toBe("/en/onboarding/terms");
  });

  it("redirige TERMS_ACCEPTED a questionary", () => {
    const path = getRouteForUser({ ...baseUser, onboardingStatus: "TERMS_ACCEPTED" }, "en");
    expect(path).toBe("/en/onboarding/questionary");
  });

  it("redirige BRAND_PROCESSING a waiting", () => {
    const path = getRouteForUser({ ...baseUser, onboardingStatus: "BRAND_PROCESSING" }, "en");
    expect(path).toBe("/en/onboarding/waiting");
  });

  it("redirige ONBOARDING_COMPLETED a dashboard/home", () => {
    const path = getRouteForUser({ ...baseUser, onboardingStatus: "ONBOARDING_COMPLETED" }, "en");
    expect(path).toBe("/en/dashboard/home");
  });
});
