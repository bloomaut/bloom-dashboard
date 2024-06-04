export enum ENV {
  DASHBOARD = "NEXT_PUBLIC_API_DASH",
  BOX = "NEXT_PUBLIC_API_BOX",
}

export type EnvironmentApi = ENV.BOX | ENV.DASHBOARD;
