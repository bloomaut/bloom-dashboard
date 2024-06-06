export interface DatasetProps {
  _id: string;
  name: string;
  dataschema: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDataset {
  name: string;
}

export interface DataschemaProps {
  _id: string;
  name: string;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
  category: string;
}
export interface Field {
  name: string;
  description: string;
  type: string;
  placeholder: string;
  _id: string;
  required: boolean;
}
export interface DataSchema {
  name: string;
  dataschema: string;
  order: number;
}
