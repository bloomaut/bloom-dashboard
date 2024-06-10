export interface Powerapp {
  _id: string;
  title: string;
  thumbnail: string;
  skinx: Skinx;
  hog_related: HogRelated;
  variables_in_use: Variablesinuse[];
}

export interface Variablesinuse {
  key: string;
  name: string;
  target: string;
  description: string;
  placeholder?: string;
  tableColumns?: any[];
  value?: string;
}

interface HogRelated {
  _id: string;
  title: string;
  thumbnail: string;
}

interface Skinx {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  thumbnail: string;
}

export interface Flake {
  typeFlake: string;
  flakeId: string;
  collection_id?: string;
  customer_id?: string;
  variables: Variable[];
}

interface Variable {
  key: string;
  target: string;
  name: string;
  value: string;
  description: string;
}
