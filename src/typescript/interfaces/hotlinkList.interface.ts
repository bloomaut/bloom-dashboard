import { Flake } from "./hotlink.interface";

export interface HotlinkCollection {
  active: boolean;
  created_at: string;
  description: string;
  flake: Flake;
  thumbnail: string;
  title: string;
  _id: string;
  name: string;
  type_flake: string;
  updated_at: string;
}
