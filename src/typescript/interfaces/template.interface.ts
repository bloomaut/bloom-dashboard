export interface Template {
  _id: string;
  category: string;
  active: boolean;
  skinx_demo: SkinxDemo;
}

export interface SkinxDemo {
  _id: string;
  title: string;
  description: null | string;
  powerapp: PowerApp[];
}

export interface PowerApp {
  _id: string;
  thumbnail: string;
  hog_related: HogRelated;
}

export interface HogRelated {
  _id: string;
  thumbnail: string;
}

export interface PutTemplate {
  skinx_id: string;
  template_id: string;
}
