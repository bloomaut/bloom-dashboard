import { UpdateBusinessLogo, UpdateBusiness, UpdatePalette } from "../interfaces/business.interface";
import { PutDataItem, UpdateDataset } from "../interfaces/catalog.interface";
import { UpdateClient } from "../interfaces/clients.interface";

export type UPDATE = UpdateClient | UpdateBusiness | UpdateBusinessLogo | UpdatePalette | UpdateDataset | PutDataItem;
