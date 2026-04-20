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

  if (user.wishList === null || user.wishList === undefined) {
    if (user.wish_list !== null && user.wish_list !== undefined) user.wishList = user.wish_list;
  }

  if (user.avatar === undefined || user.avatar === null) {
    if (user.profile_image !== null && user.profile_image !== undefined) user.avatar = user.profile_image;
    else if (user.picture !== null && user.picture !== undefined) user.avatar = user.picture;
  }

  if (typeof user.wishList !== "boolean") {
    if (user.wishList === "true") user.wishList = true;
    else if (user.wishList === "false") user.wishList = false;
    else user.wishList = Boolean(user.wishList);
  }

  return user as IUser;
}

export function getRouteForUser(user: IUser, locale: string) {
  console.log("user", user);
  const loc = locale || "en";
  const disableWishlist = process.env.NEXT_PUBLIC_DISABLE_WISHLIST === "true";
  if (user.role === "admin") return `/${loc}/backoffice/metrics`;
  if (!disableWishlist && user.wishList) return `/${loc}/onboarding/wishlist`;
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
