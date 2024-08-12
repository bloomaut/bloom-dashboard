import { PostDataSchema, PostDataItem, PostOnboarding } from "../interfaces/catalog.interface";
import { PostClient } from "../interfaces/clients.interface";
import { PostCollection } from "../interfaces/collection.interface";
import { PostFlake } from "../interfaces/flakes.interface";

export type POST = PostClient | PostFlake | PostCollection | PostDataSchema | PostDataItem | PostOnboarding | string;
