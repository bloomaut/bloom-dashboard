import { PutDataItem, PutPercentage, UpdateDataset } from "../interfaces/catalog.interface";
import { UpdateClient } from "../interfaces/clients.interface";
import { PutBusiness } from "../interfaces/business.interface";
import { PutTemplate } from "../interfaces/template.interface";
import { PutPalette } from "../interfaces/business.interface";
import { PutPowerAppDesign } from "../interfaces/designs.interface";

export type UPDATE =
  | UpdateClient
  | UpdateDataset
  | PutDataItem
  | PutBusiness
  | PutTemplate
  | PutPalette
  | PutPercentage
  | PutPowerAppDesign
  | object;
