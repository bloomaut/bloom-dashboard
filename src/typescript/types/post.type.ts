import { DataSchema } from "../interfaces/catalog.interface";
import { ClientsProps } from "../interfaces/clients.interface";
import { Collection } from "../interfaces/collection.interface";
import { Flake } from "../interfaces/flakes.interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type POST = ClientsProps | Flake | Collection | DataSchema;
