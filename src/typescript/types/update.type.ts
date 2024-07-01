import { PutDataItem, UpdateDataset } from "../interfaces/catalog.interface";
import { UpdateClient } from "../interfaces/clients.interface";

export type UPDATE = UpdateClient | UpdateDataset | PutDataItem;
