export interface PaletteItem {
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
}

export interface BusinessDataProps {
  client_id: number | null;
  createdAt: string;
  description: string;
  email: string;
  instagram: string;
  logo: string;
  name: string;
  palette: PaletteItem[];
  phone: string;
  step: number | null;
  updatedAt: string;
  website: string;
  _id: string;
}
