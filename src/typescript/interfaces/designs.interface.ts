import { HogRelated } from "./flakes.interface";

export interface PostPowerAppDesign {
  pwa_id: string;
  flake_id: string;
  type_design: string;
}
export interface DesignsProps {
  type: string;
  data: HogRelated[];
}

export interface DesignSelected {
  flake: HogRelated;
  powerapp: HogRelated;
  type_design: string;
  variables: VariablesFormDesign[];
}

interface VariablesFormDesign {
  description: string;
  key: string;
  name: string;
  target: string;
  value: string;
}
