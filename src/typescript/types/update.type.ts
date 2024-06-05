import { UpdateBusinessLogo, UpdateBusiness, UpdatePalette } from "../interfaces/business.interface";
import { UpdateDataset } from "../interfaces/catalog.interface";
import { UpdateClient } from "../interfaces/clients.interface";

export type UPDATE = UpdateClient | UpdateBusiness | UpdateBusinessLogo | UpdatePalette | UpdateDataset;
