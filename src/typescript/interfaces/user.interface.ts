// Definición de tipos comunes
type ID = number | null;
type Timestamp = string;
type Nullable<T> = T | null;

export interface ClientDataProps {
  active: Nullable<number>;
  company_web: string;
  created_at: Timestamp;
  cuit: string;
  id: ID;
  logo: string;
  name: string;
  razon_social: string;
}

export interface UserDataProps {
  active: Nullable<number>;
  auth0_id: string;
  client: ClientDataProps;
  company_position: string;
  created_at: Timestamp;
  email: string;
  id: ID;
  name: string;
  password: string;
  phone: string;
}

export interface Subdomain {
  id: number;
  base_url: string;
  subdomain: string;
  full_domain: string;
  registration: "free" | "purchased";
  created_at: Date;
  updated_at: Date;
  flake_landing: null | { _id: string };
}
