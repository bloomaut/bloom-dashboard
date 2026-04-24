import { IUser } from "@/typescript/interfaces/business.interface";

export type UserMeResponse = {
  statusCode?: number;
  result?: {
    user?: IUser;
  };
  user?: IUser;
};

export function extractUserFromMeResponse(me: unknown): IUser | null {
  const data = me as any;
  const user = (data?.result?.user ?? data?.user ?? data?.data?.result?.user ?? data?.data?.user ?? null) as any;
  if (!user) return null;

  if (user.onboarding_status === null || user.onboarding_status === undefined) {
    if (user.onboardingStatus !== null && user.onboardingStatus !== undefined)
      user.onboarding_status = user.onboardingStatus;
  }

  if (user.avatar === undefined || user.avatar === null) {
    if (user.profile_image !== null && user.profile_image !== undefined) user.avatar = user.profile_image;
    else if (user.picture !== null && user.picture !== undefined) user.avatar = user.picture;
  }

  if (typeof user.wish_list !== "boolean") {
    if (user.wish_list === "true") user.wish_list = true;
    else if (user.wish_list === "false") user.wish_list = false;
    else user.wish_list = Boolean(user.wish_list);
  }

  return user as IUser;
}

export function getRouteForUser(user: IUser, loc: string): string {
  const disableWishlist = process.env.NEXT_PUBLIC_DISABLE_WISHLIST === "true";
  if (!disableWishlist && user.wish_list) return `/${loc}/onboarding/wishlist`;
  if (user.role === "admin") return `/${loc}/backoffice/metrics`;
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
