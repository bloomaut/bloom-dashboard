import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import dataSchemaSlice from "./features/dataschemaSlice";
import ricardoSlice from "./features/ricardoSlice";
import subdomainsSlice from "./features/subdomainsSlice";

export const store = configureStore({
  reducer: {
    userData: userSlice,
    dataschema: dataSchemaSlice,
    ricardosData: ricardoSlice,
    subdomainsData: subdomainsSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
