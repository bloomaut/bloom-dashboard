export interface ClientsProps {
  _id?: string;
  ClientFirstname: string;
  ClientLastname: string;
  ClientEmail: string;
  ClientLocation: string;
  ClientPhone: string;
  personalNote: string;
  clientCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateClient {
  ClientFirstname: string;
  ClientLastname: string;
  ClientEmail: string;
  ClientPhone: string;
  ClientLocation: string;
  personalNote: string;
}
