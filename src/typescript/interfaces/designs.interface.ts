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

export interface DesignsProps {
  type: string;
  data: HogRelated[];
  designs: any[];
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
