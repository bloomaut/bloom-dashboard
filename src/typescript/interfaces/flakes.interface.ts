export interface Powerapp {
  _id: string;
  title: string;
  thumbnail: string;
  skinx: Skinx;
  hog_related: Hogrelated;
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

interface Hogrelated {
  _id: string;
  title: string;
  thumbnail: string;
}

interface Skinx {
  _id: string;
  title: string;
  description?: any;
  category?: any;
  thumbnail: string;
}
