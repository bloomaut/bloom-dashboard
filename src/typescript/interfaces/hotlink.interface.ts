export interface HotlinkData {
  hotlink: Hotlink;
}

export interface Hotlink {
  id?: string;
  power_app_hash: string;
}

export interface HotlinkList {
  id: string;
  hash: string;
  url: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  flake_power_app: Flake;
  customer?: Customer;
}

export interface Flake {
  _id: string;
  title: string;
  thumbnail: string;
  skinx: Skinx;
}

export interface Skinx {
  _id: string;
  title: string;
  thumbnail: string;
}

export interface Customer {
  _id?: string;
  client_id: string;
  auth0_id: string;
  ClientEmail?: string;
  ClientFirstname?: string;
  ClientLastname?: string;
  ClientPhone?: string;
  ClientLocation?: string;
  ClientAvatar?: string | null;
  personalNote?: string;
  phoneContactId?: string | null;
  clientCode?: string;
  createdAt: string;
  updatedAt: string;
}
