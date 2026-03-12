import { IUser } from "@/typescript/interfaces/business.interface";

export type UserMeResponse = {
  statusCode?: number;
  result?: {
    user?: IUser;
  };
  user?: IUser;
};

export function extractUserFromMeResponse(me: unknown): IUser | null {
  const data = me as UserMeResponse | null | undefined;
  const user = (data?.result?.user ?? data?.user ?? null) as any;
  if (!user) return null;
  if (user.onboarding_status === null || user.onboarding_status === undefined) {
    if (user.onboardingStatus !== null && user.onboardingStatus !== undefined) {
      user.onboarding_status = user.onboardingStatus;
    }
  }
  return user as IUser;
}

export function getRouteForUser(user: IUser, locale: string) {
  console.log("user", user);
  const loc = locale || "en";
  if (user.role === "admin") return `/${loc}/backoffice/metrics`;
  if (user.wishList) return `/${loc}/onboarding/wishlist`;
  console.log("user.onboarding_status", user.onboarding_status);
  switch (user.onboarding_status) {
    case "FIRST_LOGIN":
      return `/${loc}/onboarding/terms`;
    case "TERMS_ACCEPTED":
      return `/${loc}/onboarding/questionary`;
    case "BRAND_PROCESSING":
      return `/${loc}/onboarding/waiting`;
    case "BRAND_COMPLETED":
    case "SOCIAL_CONNECTED":
    case "ONBOARDING_COMPLETED":
      return `/${loc}/dashboard/home`;
    case "ONBOARDING_REJECTED":
      return `/${loc}`;
    default:
      return `/${loc}/onboarding`;
  }
}
