import { PostDataSchema, PostDataItem, PostOnboarding } from "../interfaces/catalog.interface";
import { PostClient } from "../interfaces/clients.interface";
import { PostPowerAppDesign, PostPowerAppPre } from "../interfaces/designs.interface";
import { PostFlake } from "../interfaces/flakes.interface";
import { PostFAQ } from "../interfaces/faq.interface";

export type POST =
  | PostClient
  | PostFlake
  | PostDataSchema
  | PostDataItem
  | PostOnboarding
  | PostPowerAppPre
  | PostPowerAppDesign
  | PostFAQ
  | string;
