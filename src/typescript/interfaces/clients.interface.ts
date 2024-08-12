// Definición de tipos comunes
type ID = string;
type Timestamp = string;

export interface ClientsProps {
  _id?: ID;
  ClientFirstname?: string;
  ClientLastname?: string;
  ClientEmail: string;
  ClientLocation: string;
  ClientPhone: string;
  personalNote: string;
  ClientCode?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface UpdateClient {
  ClientFirstname: string;
  ClientLastname: string;
  ClientEmail: string;
  ClientPhone: string;
  ClientLocation: string;
  personalNote: string;
}

export type PostClient = ClientsProps;
