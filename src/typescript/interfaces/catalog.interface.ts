// Definición de tipos comunes
type ID = string;
type Timestamp = string;
type Nullable<T> = T | null;

// Interfaces principales
export interface DataItemsList {
  [key: string]: any;
}

export interface DataItems {
  order: number;
  _id: ID;
  data: DataItemsList;
  totalDataItems: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AllProductsDataset {
  visibility: boolean;
  _id: ID;
  name: string;
}

export interface AllProducts {
  _id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  data: DataItemsList;
  dataset: AllProductsDataset;
  order: number;
  visibility: boolean;
}

export interface DatasetProps {
  _id: ID;
  name: string;
  description: string;
  image: string;
  visibility: boolean;
  dataschema?: DataschemaProps[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  totalDataItems: number;
  order: number;
}

export interface UpdateDataset {
  name: string;
}

export interface PostDataItem {
  dataset: ID;
  data: DataItemsList | undefined;
  order: Nullable<number>;
  visibility: boolean;
}

export interface PutDataItem {
  data: DataItemsList | undefined;
  order: Nullable<number>;
  visibility: boolean;
}

export interface SelectOption {
  title: string;
  value: string;
}

// Interfaces relacionadas con Dataschema
export interface DataschemaProps {
  _id: string;
  name: string;
  fields: DataschemaField[];
  createdAt: string;
  updatedAt: string;
  category: string;
}

export interface DataschemaField {
  name: string;
  description: string;
  type: string;
  placeholder: string;
  _id: string;
  required: boolean;
}

interface DatasetProp {
  _id: string;
  dataschema?: DataschemaProps;
}

// Interfaces para Onboarding y porcentaje
export interface PostDataSchema {
  name: string;
  description: string;
  dataschema: ID;
  order: number;
}

export interface PostOnboarding {
  template_id: ID;
  onboarding_id: ID;
}

export interface PutPercentage {
  percentage: string | number;
}

// Detalle de Dataset
export interface DatasetDetailType {
  dataItems: DataItemsType[];
  dataSet: DatasetProp;
}

export interface DataItemsType {
  createdAt: Timestamp;
  data: {
    listdescr: string;
    listimage: string;
    listname: string;
    listprice: string;
  };
  order: number;
  updatedAt: Timestamp;
  visibility: boolean;
  _id: ID;
}
