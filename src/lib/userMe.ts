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
  return (data?.result?.user ?? data?.user ?? null) as IUser | null;
}

export function getRouteForUser(user: IUser, locale: string) {
  const loc = locale || "en";
  if (user.role === "admin") return `/${loc}/backoffice/metrics`;
  if (user.wishList) return `/${loc}/onboarding/wishlist`;

  switch (user.onboardingStatus) {
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
