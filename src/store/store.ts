import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import dataSchemaSlice from "./features/dataschemaSlice";

export const store = configureStore({
  reducer: {
    userData: userSlice,
    dataschema: dataSchemaSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
