import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserBusiness } from "@/typescript/interfaces/business.interface";

export const userInitialState: UserBusiness = {
  id: null,
  auth0_id: "",
  name: null,
  lastname: null,
  email: "",
  phone: "",
  company_position: "",
  active: true,
  created_at: "",
  updated_at: "",
  client: {
    id: null,
    name: null,
    cuit: "",
    razon_social: "",
    company_web: "",
    logo: "",
    active: true,
    instagram: null,
    description: null,
    category: [],
    palette: null,
    created_at: "",
    updated_at: "",
    onboardings: null,
  },
};

export const userSlice = createSlice({
  name: "userData",
  initialState: userInitialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserBusiness>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserData } = userSlice.actions;
export const userState = (state: RootState) => state.userData;
export default userSlice.reducer;
