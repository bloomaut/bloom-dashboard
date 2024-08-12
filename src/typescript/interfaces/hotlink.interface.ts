// Definición de tipos comunes
type ID = string;
type Timestamp = string;
type Nullable<T> = T | null;

// Interfaces principales
export interface HotlinkData {
  hotlink: Hotlink;
}

export interface Hotlink {
  id?: ID;
  power_app_hash: string;
}

export interface HotlinkList {
  id: ID;
  hash: string;
  url: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  customer_id: ID;
  flake_power_app: Flake;
  customer?: Customer;
  variables: Variable[];
}

export interface Flake {
  _id: ID;
  title: string;
  thumbnail: string;
  skinx: Skinx;
}

export interface Skinx {
  _id: ID;
  title: string;
  thumbnail: string;
}

export interface Customer {
  _id?: ID;
  client_id: string;
  auth0_id: string;
  clientEmail?: string;
  clientFirstname?: string;
  clientLastname?: string;
  clientPhone?: string;
  clientLocation?: string;
  clientAvatar?: Nullable<string>;
  personalNote?: string;
  phoneContactId?: Nullable<string>;
  clientCode?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Variable {
  key: string;
  name: string;
  target: string;
  description: string;
  value: string;
  tableColumns: TableColumn[];
}

export interface TableColumn {}
