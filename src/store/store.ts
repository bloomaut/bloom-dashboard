import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import businessSlice from "./features/businessSlice";
import filesSlice from "./features/filesSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    business: businessSlice,
    files: filesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
