interface Dataschema {
  _id: string;
  fields: DatasetField[];
}

interface DatasetField {
  _id: string;
  name: string;
  description: string;
  type: "string" | "number" | "image";
  placeholder: string;
  required: boolean;
}

export interface DataItemsList {
  listname: string;
  listdescr: string;
  listimage: string;
  listprice: number;
}

interface DataItems {
  order: number;
  _id: string;
  data: DataItemsList;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetProps {
  order: number;
  _id: string;
  name: string;
  dataschema: Dataschema;
  createdAt: string;
  updatedAt: string;
}

export interface Dataset {
  dataItems: DataItems[];
  dataSet: DatasetProps;
}

export interface UpdateDataset {
  name: string;
}

export interface PostDataItem {
  dataset: string;
  data: DataItemsList;
  order: number;
}
