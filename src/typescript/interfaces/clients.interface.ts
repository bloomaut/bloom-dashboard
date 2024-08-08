// Definición de tipos comunes
type ID = string;
type Timestamp = string;

export interface ClientsProps {
  _id?: ID;
  clientFirstname: string;
  clientLastname: string;
  clientEmail: string;
  clientLocation: string;
  clientPhone: string;
  personalNote: string;
  clientCode?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface UpdateClient {
  clientFirstname: string;
  clientLastname: string;
  clientEmail: string;
  clientPhone: string;
  clientLocation: string;
  personalNote: string;
}

export type PostClient = ClientsProps;
