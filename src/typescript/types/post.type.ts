import { Collection } from "@/routes/NewCollection";
import { ClientsProps } from "../interfaces/clients.interface";
import { Flake } from "../interfaces/flakes.interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type POST = ClientsProps | Flake | Collection;
