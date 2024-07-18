import { PutDataItem, UpdateDataset } from "../interfaces/catalog.interface";
import { UpdateClient } from "../interfaces/clients.interface";
import { PutBusiness } from "../interfaces/business.interface";

export type UPDATE = UpdateClient | UpdateDataset | PutDataItem | PutBusiness;
