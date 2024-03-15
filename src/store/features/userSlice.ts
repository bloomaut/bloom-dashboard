import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserDataProps } from "@/typescript/interfaces/user.interface";

export const userInitialState: UserDataProps = {
  active: null,
  auth0_id: "",
  client: {
    active: null,
    company_web: "",
    created_at: "",
    cuit: "",
    id: null,
    logo: "",
    name: "",
    razon_social: "",
  },
  company_position: "",
  created_at: "",
  email: "",
  id: null,
  name: "",
  password: "",
  phone: "",
};

export const UserSlice = createSlice({
  name: "userData",
  initialState: userInitialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserDataProps>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setUserData } = UserSlice.actions;
export const userState = (state: RootState) => state.user;
export default UserSlice.reducer;
