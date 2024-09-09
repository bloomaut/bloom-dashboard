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
