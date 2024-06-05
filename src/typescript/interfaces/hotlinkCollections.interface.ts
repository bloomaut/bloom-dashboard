import { Flake } from "./hotlink.interface";

export interface CollectionList {
  _id: string;
  name: string;
  description: string;
  type_flake: string;
  created_at: string;
  updated_at: string;
  hotlinkCount: string;
  flake: Flake;
}
