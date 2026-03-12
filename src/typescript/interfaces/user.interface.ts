type Nullable<T> = T | null;

export type UserRole = string;
export type OnboardingStatus = string;
export type SubscriptionType = string;

export type ClientInfo = Record<string, unknown>;

export interface IUser {
  id: string | number;
  name: string;
  lastname: Nullable<string>;
  phone: Nullable<string>;
  email: string;
  active: boolean;
  role: UserRole;
  onboardingStatus: OnboardingStatus;
  wishList: boolean;
  suscription: SubscriptionType;
  client: ClientInfo | null;
  created_at?: string;
  updated_at?: string;
}
