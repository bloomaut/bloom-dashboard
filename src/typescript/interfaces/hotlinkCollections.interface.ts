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

export interface Flake {
  _id: string;
  title: string;
  thumbnail: string;
  skinx: Skinx;
}

interface Skinx {
  _id: string;
  title: string;
  thumbnail: string;
}
