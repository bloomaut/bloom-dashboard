import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import businessSlice from "./features/businessSlice";
import filesSlice from "./features/filesSlice";
import ClientsSlice from "./features/clientsSlice";
import DataschemaSlice from "./features/dataschemaSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    business: businessSlice,
    files: filesSlice,
    clients: ClientsSlice,
    dataschema: DataschemaSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
