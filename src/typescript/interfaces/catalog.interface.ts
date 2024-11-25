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

export interface DatasetProps {
  _id: ID;
  name: string;
  description: string;
  image: string;
  visibility: boolean;
  dataschema: DataschemaProps;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  totalDataItems: number;
  order: number;
}

export interface ServicesProps {
  _id: ID;
  name: string;
  description: string;
  image: string;
  visibility: boolean;
  dataschema: DataschemaProps;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  dataset: ID;
  data: DataItemsList | undefined;
  order?: number;
  visibility: boolean;
}

export interface PutDataItem {
  data: DataItemsList | undefined;
  order?: number;
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
  name?: string;
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
  onboarding_id?: ID;
}

export interface PutPercentage {
  percentage: string | number;
}

/* ********** PRODUCTS ********** */

export interface DatasetDetailProduct {
  dataItems: ProductDataItem[];
  dataSet: DatasetProp;
}

export interface ProductDataItem {
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

export interface AllProducts {
  _id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  data: DataItemsList;
  dataset: AllProductsDataset;
  isVariant: boolean;
  variants: any[];
  order: number;
  visibility: boolean;
}

/* ********** STORE ********** */

export interface DatasetDetailStore {
  dataItems: StoreDataItem[];
  dataSet: DatasetProp;
}

export interface StoreDataItem {
  createdAt: Timestamp;
  data: {
    listdescr: string;
    listimage: string;
    listname: string;
    listprice: string;
    productBrand: string;
    productModel: string;
    productGenre: string;
    productAge: string;
    productColor: string;
    productSize: string;
    productMaterial: string;
  };
  isVariant: boolean;
  variants: any[];
  order: number;
  updatedAt: Timestamp;
  visibility: boolean;
  _id: ID;
}

/* ********** SERVICES ********** */

export interface DatasetDetailServices {
  dataItems: DataItemsServiceType[];
  dataSet: DatasetProp;
}

export interface ServiceData {
  serviceName: string;
  serviceDescr: string;
  servicePrice: number;
  serviceImage: string;
  duration?: number;
  simultaneous?: number;
  lunchFrom?: string;
  lunchTo?: string;
  mondayFrom: string;
  mondayTo: string;
  tuesdayFrom: string;
  tuesdayTo: string;
  wednesdayFrom: string;
  wednesdayTo: string;
  thursdayFrom: string;
  thursdayTo: string;
  fridayFrom: string;
  fridayTo: string;
  saturdayFrom: string;
  saturdayTo: string;
  sundayFrom: string;
  sundayTo: string;
}

export interface DataItemsServiceType {
  createdAt: Timestamp;
  data: ServiceData;
  dataset?: AllProductsDataset;
  order: number;
  updatedAt: Timestamp;
  visibility: boolean;
  _id: ID;
}
