// Definición de tipos comunes
type Nullable<T> = T | null;
type ColorPalette = Nullable<{ color: string }[]>;

// Interfaces principales
export interface UserBusiness {
  id?: number | null;
  auth0_id?: string;
  name: Nullable<string>;
  lastname: Nullable<string>;
  email?: string;
  phone: string;
  subdomain?: string;
  company_position?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  client: Client;
  isCatalogComplete?: boolean;
  founded?: number;
  employees?: number;
}

export interface UserBusinessSelector {
  userData: UserBusiness;
}

export interface Client {
  id?: number | null;
  name: Nullable<string>;
  cuit?: string;
  banner: Nullable<string>;
  razon_social?: string;
  company_web: string;
  logo: string;
  active?: boolean;
  instagram: Nullable<string>;
  facebook: Nullable<string>;
  tiktok: Nullable<string>;
  description: Nullable<string>;
  category: Nullable<string>;
  palette: ColorPalette;
  created_at?: string;
  updated_at?: string;
  address: string;
  proposal_status?: string;
  proposal_url?: string | null;
  wish_list?: boolean;
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
  palette: ColorPalette | undefined;
}

export interface PutPalette {
  palette: ColorPalette;
}
