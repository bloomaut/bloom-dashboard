import { PostDataSchema, PostDataItem, PostOnboarding } from "../interfaces/catalog.interface";
import { ClientsProps } from "../interfaces/clients.interface";
import { Collection } from "../interfaces/collection.interface";
import { Flake } from "../interfaces/flakes.interface";

export type POST = ClientsProps | Flake | Collection | PostDataSchema | PostDataItem | PostOnboarding | string;
