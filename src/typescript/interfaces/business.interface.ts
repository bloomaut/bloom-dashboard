export interface UserBusiness {
  id?: number | null;
  auth0_id?: string;
  name: string | null;
  lastname: string | null;
  email?: string;
  phone: string;
  company_position?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  client: Client;
}

export interface Client {
  id?: number | null;
  name: string | null;
  cuit?: string;
  banner: string | null;
  razon_social?: string;
  company_web: string;
  logo: string;
  active?: boolean;
  instagram: string | null;
  description: string | null;
  category: string | null;
  palette: { color: string }[] | null;
  created_at?: string;
  updated_at?: string;
  onboardings?: Onboardings | null;
}

export interface Onboardings {
  _id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  skinx_template: SkinxTemplate;
  skinx_generated: SkinxGenerated;
}

interface SkinxTemplate {
  _id: string;
}

interface SkinxGenerated {
  _id: string;
}

export interface PutBusiness {
  userName: string | null;
  userLastname: string | null;
  clientName: string | null;
  description: string | null;
  website: string | null;
  instagram: string | null;
  phone: string | null;
  logo: string | null;
  palette: { color: string }[] | null;
}
