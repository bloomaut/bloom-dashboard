import { PostDataSchema, PostDataItem, PostOnboarding } from "../interfaces/catalog.interface";
import { PostClient } from "../interfaces/clients.interface";
import { PostFlake } from "../interfaces/flakes.interface";

export type POST = PostClient | PostFlake | PostDataSchema | PostDataItem | PostOnboarding | string;
