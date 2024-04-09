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

interface Flake {
  skinx: Skinx;
  thumbnail: string;
  title: string;
  _id: string;
}

interface Skinx {
  _id: string;
  title: string;
  thumbnail: string;
}
