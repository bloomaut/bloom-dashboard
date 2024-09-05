// Definición de tipos comunes
type ID = string;
type Nullable<T> = T | null;

// Interfaces principales
export interface Powerapp {
  _id: ID;
  title: string;
  thumbnail: string;
  skinx: Skinx;
  hog_related: HogRelated;
  variables_in_use: VariableInUse[];
}

export interface VariableInUse {
  key: string;
  name: string;
  target: string;
  description: string;
  placeholder?: string;
  tableColumns?: string[];
  value?: string;
}

export interface HogRelated {
  _id: ID;
  title: string;
  thumbnail: string;
}

interface Skinx {
  _id: ID;
  title: string;
  description?: string;
  category?: string;
  thumbnail: string;
}

export interface Flake {
  typeFlake: string;
  flakeId: string;
  customer_id?: ID;
  variables: Variable[];
}

interface Variable {
  key: string;
  target: string;
  name: string;
  value: string;
  description: string;
}

export type PostFlake = Flake;
