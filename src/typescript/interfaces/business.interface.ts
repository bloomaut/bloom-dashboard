export interface PaletteItem {
  color: string;
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

export interface UpdateBusiness {
  name: string;
  website: string;
  description: string;
  instagram: string;
  phone: string;
}

export interface UpdateBusinessLogo {
  logo: string;
}

export interface UpdatePalette {
  palette: PaletteItem[];
}
