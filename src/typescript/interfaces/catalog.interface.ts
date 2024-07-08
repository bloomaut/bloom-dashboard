interface Dataschema {
  _id: string;
  fields: DatasetField[];
}

export interface DatasetField {
  _id: string;
  name: string;
  description: string;
  type: "string" | "number" | "image";
  placeholder: string;
  required: boolean;
}

export interface DataItemsList {
  [key: string]: any;
}

interface DataItems {
  order: number;
  _id: string;
  data: DataItemsList;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetProps {
  _id: string;
  name: string;
  dataschema: string;
  createdAt: string;
  updatedAt: string;
  totalDataItems: number;
}

export interface UpdateDataset {
  name: string;
}

export interface PostDataItem {
  dataset: string;
  data: DataItemsList | undefined;
  order: number;
}

export interface PutDataItem {
  data: DataItemsList | undefined;
  order: number;
}

export interface selectOptions {
  title: string;
  value: string;
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
  visibility: boolean;
}
