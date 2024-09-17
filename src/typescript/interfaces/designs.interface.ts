import { HogRelated } from "./flakes.interface";

export interface PostPowerAppDesign {
  title: string;
  description: string;
  variables: VariablesFormDesign[];
  pwa_id: string;
  flake_id: string;
  type_design: string;
}

export interface PostPowerAppPre {
  pwa_id: string;
  flake_id: string;
  type_design: string;
}

export interface DesignProps {
  _id: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  type_design: string | null;
  data: any;
  variables: VariablesFormDesign[];
  active: boolean;
  created_at: string;
  email: any;
  post: any;
  power_app: HogRelated;
  hog: HogRelated;
}

export interface DiffusionProps {
  type: string;
  hogs: HogRelated[];
  designs: DesignProps[];
}

export interface DesignSelected {
  flake: HogRelated;
  powerapp: HogRelated;
  type_design: string;
  variables: VariablesFormDesign[];
}

export interface VariablesFormDesign {
  description: string;
  key: string;
  name: string;
  target: string;
  value: string;
}
