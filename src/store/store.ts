import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import filesSlice from "./features/filesSlice";
import dataSchemaSlice from "./features/dataschemaSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    files: filesSlice,
    dataschema: dataSchemaSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
