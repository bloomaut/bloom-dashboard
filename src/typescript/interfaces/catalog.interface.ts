export interface DataItemsList {
  [key: string]: any;
}

export interface DataItems {
  order: number;
  _id: string;
  data: DataItemsList;
  totalDataItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface AllProductsDataset {
  visibility: boolean;
  _id: string;
  name: string;
}

export interface AllProducts {
  _id: string;
  createdAt: string;
  updatedAt: string;
  data: DataItemsList;
  dataset: AllProductsDataset;
  order: number;
  visibility: boolean;
}

export interface DatasetProps {
  _id: string;
  name: string;
  description: string;
  image: string;
  visibility: boolean;
  dataschema?: DataSchemaProps;
  createdAt: string;
  updatedAt: string;
  totalDataItems: number;
  order: number;
}

export interface DataSchemaProps {
  category: string;
  fields: Array<DataschemaField>;
  name: string;
  _id: string;
}

export interface UpdateDataset {
  name: string;
}

export interface PostDataItem {
  dataset: string;
  data: DataItemsList | undefined;
  order?: number | null;
  visibility: boolean;
}

export interface PutDataItem {
  data: DataItemsList | undefined;
  order: number | null;
  visibility: boolean;
}

export interface selectOptions {
  title: string;
  value: string;
}

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

export interface PostDataSchema {
  name: string;
  description: string;
  dataschema: string;
  order: number;
  // image: string;
}

export interface PostOnboarding {
  template_id: string;
  onboarding_id: string;
}

export interface PutPorcentage {
  percentage: string | number;
}

export interface DatasetDetailType {
  dataItems: Array<DataItemsType>;
  dataSet: DatasetProps;
}

interface DataItemsType {
  createdAt: string;
  data: {
    listdescr: string;
    listimage: string;
    listname: string;
    listprice: string;
  };
  order: number;
  updatedAt: string;
  visibility: boolean;
  _id: string;
}
