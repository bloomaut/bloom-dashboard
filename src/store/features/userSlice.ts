import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IUser } from "@/typescript/interfaces/business.interface";

export const userInitialState: IUser = {
  id: null,
  name: "",
  lastname: null,
  phone: null,
  email: "",
  active: false,
  role: "user",
  onboarding_status: "FIRST_LOGIN",
  avatar: null,
  wishList: false,
  suscription: "free",
  client: null,
};

export const userSlice = createSlice({
  name: "userData",
  initialState: userInitialState,
  reducers: {
    setUserData: (_state, action: PayloadAction<IUser>) => {
      return action.payload;
    },
    updateClientData: (state, action: PayloadAction<Partial<NonNullable<IUser["client"]>>>) => {
      state.client = { ...(state.client || {}), ...action.payload };
    },
    clearUserData: _state => {
      return userInitialState;
    },
  },
});

export const { setUserData, updateClientData, clearUserData } = userSlice.actions;
export const userState = (state: RootState) => state.userData;
export default userSlice.reducer;
