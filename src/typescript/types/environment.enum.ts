export enum ENV {
  DASH = "NEXT_PUBLIC_API_DASH",
  BOX = "NEXT_PUBLIC_API_BOX",
  UITOOL = "NEXT_PUBLIC_API_UITOOL",
}

export type EnvironmentApi = ENV.DASH | ENV.BOX | ENV.UITOOL;
