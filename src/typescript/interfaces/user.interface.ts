interface ClientDataProps {
  active: number | null;
  company_web: string;
  created_at: string;
  cuit: string;
  id: number | null;
  logo: string;
  name: string;
  razon_social: string;
}

export interface UserDataProps {
  active: number | null;
  auth0_id: string;
  client: ClientDataProps;
  company_position: string;
  created_at: string;
  email: string;
  id: number | null;
  name: string;
  password: string;
  phone: string;
}
