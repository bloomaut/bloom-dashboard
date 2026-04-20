type Nullable<T> = T | null;

export type UserRole = string;
export type OnboardingStatus = string;
export type SubscriptionType = string;

export type ClientInfo = {
  id?: string | number | null;
  name?: Nullable<string>;
  cuit?: Nullable<string>;
  company_web?: Nullable<string>;
  logo?: Nullable<string>;
  banner?: Nullable<string>;
  address?: Nullable<string>;
  instagram?: Nullable<string>;
  facebook?: Nullable<string>;
  tiktok?: Nullable<string>;
  description?: Nullable<string>;
  category?: Nullable<string>;
  palette?: string | null;
  proposal_url?: Nullable<string>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export interface IUser {
  id: string | number | null;
  oauth_id?: string | null;
  name: string;
  lastname: Nullable<string>;
  phone: Nullable<string>;
  email: string;
  active: boolean;
  role: UserRole;
  onboardingStatus?: OnboardingStatus;
  onboarding_status: OnboardingStatus;
  avatar: string | null;
  wish_list?: boolean;
  wishList: boolean;
  suscription: SubscriptionType;
  client: ClientInfo | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserBusinessSelector {
  userData: IUser;
}

// Interfaces para actualización de datos
export interface PutBusiness {
  userName: Nullable<string>;
  userLastname: Nullable<string>;
  clientName: Nullable<string>;
  description: Nullable<string>;
  website: Nullable<string>;
  instagram: Nullable<string>;
  phone: Nullable<string>;
  logo: Nullable<string>;
  palette: string | null; // Actualizado para coincidir con el nuevo formato
}

export interface PutPalette {
  palette: string | null; // Actualizado para coincidir con el nuevo formato
}

// Interfaz para manejar la paleta como array (para uso interno en componentes)
export interface ColorPaletteItem {
  color: string;
  name?: string;
}

// Utilidad para convertir string de paleta a array
export const parsePaletteString = (paletteString: string | null): ColorPaletteItem[] => {
  if (!paletteString) return [];

  return paletteString.split(",").map((color, index) => ({
    color: color.trim(),
    name: `Color ${index + 1}`,
  }));
};

// Utilidad para convertir array de paleta a string
export const stringifyPalette = (palette: ColorPaletteItem[]): string => {
  return palette.map(item => item.color).join(",");
};
