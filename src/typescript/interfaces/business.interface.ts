export interface UserBusiness {
  id: number;
  auth0_id: string;
  name: string;
  lastname: string | null;
  email: string;
  phone: string;
  company_position: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  client: Client;
}

export interface Client {
  id: number;
  name: string;
  cuit: string;
  razon_social: string;
  company_web: string;
  logo: string;
  active: boolean;
  instagram: string | null;
  description: string | null;
  category: [] | null;
  palette: [] | null;
  created_at: string;
  updated_at: string;
}
