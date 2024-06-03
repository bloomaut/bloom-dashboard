import { BusinessLogo, PaletteItem, UpdateBusiness, UpdatePalette } from "../interfaces/business.interface";
import { UpdateClient } from "../interfaces/clients.interface";

export type UPDATE = UpdateClient | UpdateBusiness | BusinessLogo | UpdatePalette;
