import { HogRelated } from "./flakes.interface";

// Definición de tipos comunes
type ID = string;
type Nullable<T> = T | null;

export interface Template {
  _id: ID;
  category: string;
  active: boolean;
  skinx_demo: SkinxDemo;
}

export interface SkinxDemo {
  _id: ID;
  title: string;
  description: Nullable<string>;
  powerapp: PowerApp[];
}

export interface PowerApp {
  _id: ID;
  thumbnail: string;
  hog_related: HogRelated;
}

export interface PutTemplate {
  template_id: ID;
}
