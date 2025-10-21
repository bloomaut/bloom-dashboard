import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserBusiness } from "@/typescript/interfaces/business.interface";

export const userInitialState: UserBusiness = {
  id: null,
  auth0_id: "",
  role: "default",
  name: "",
  lastname: null,
  email: "",
  phone: null,
  active: true,
  created_at: "",
  updated_at: "",
  client: {
    id: null,
    name: "",
    cuit: null,
    company_web: null,
    logo: null,
    role: "ricardo",
    banner: null,
    address: null,
    active: true,
    wish_list: false,
    instagram: null,
    facebook: null,
    tiktok: null,
    description: null,
    category: null,
    palette: null,
    proposal_url: null,
    suscription: "free",
    proposal_status: "pending",
    created_at: "",
    updated_at: "",
  },
  isCatalogComplete: false,
};

export const userSlice = createSlice({
  name: "userData",
  initialState: userInitialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserBusiness>) => {
      return {
        ...state,
        ...action.payload,
        client: {
          ...state.client,
          ...action.payload.client,
        },
      };
    },
    setCatalogComplete: (state, action: PayloadAction<boolean>) => {
      return { ...state, isCatalogComplete: action.payload };
    },
    // Nuevo reducer para actualizar solo datos del cliente
    updateClientData: (state, action: PayloadAction<Partial<UserBusiness["client"]>>) => {
      state.client = { ...state.client, ...action.payload };
    },
    // Nuevo reducer para limpiar datos del usuario
    clearUserData: state => {
      return userInitialState;
    },
  },
});

export const { setUserData, setCatalogComplete, updateClientData, clearUserData } = userSlice.actions;
export const userState = (state: RootState) => state.userData;
export default userSlice.reducer;
