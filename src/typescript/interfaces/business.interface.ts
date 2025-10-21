// Definición de tipos comunes
type Nullable<T> = T | null;

// Interfaces principales
export interface UserBusiness {
  id?: number | null;
  auth0_id?: string;
  role?: string;
  name: Nullable<string>;
  lastname: Nullable<string>;
  email?: string;
  phone: Nullable<string>;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  client: Client;
  isCatalogComplete?: boolean;
}

export interface UserBusinessSelector {
  userData: UserBusiness;
}

export interface Client {
  id?: number | null;
  name: Nullable<string>;
  cuit: Nullable<string>;
  company_web: Nullable<string>;
  logo: Nullable<string>;
  role?: string;
  banner: Nullable<string>;
  address: Nullable<string>;
  active?: boolean;
  wish_list?: boolean;
  instagram: Nullable<string>;
  facebook: Nullable<string>;
  tiktok: Nullable<string>;
  description: Nullable<string>;
  category: Nullable<string>;
  palette: string | null; // Cambiado a string para manejar el formato del API
  proposal_url: Nullable<string>;
  suscription?: string;
  proposal_status?: string;
  created_at?: string;
  updated_at?: string;
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
