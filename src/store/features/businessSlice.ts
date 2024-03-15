import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { BusinessDataProps } from "@/typescript/interfaces/business.interface";

export const businessInitialData: BusinessDataProps = {
  client_id: null,
  createdAt: "",
  description: "",
  email: "",
  instagram: "",
  logo: "",
  name: "",
  palette: [],
  phone: "",
  step: null,
  updatedAt: "",
  website: "",
  _id: "",
};

export const BusinessSlice = createSlice({
  name: "businessData",
  initialState: businessInitialData,
  reducers: {
    setBusinessData: (state, action: PayloadAction<BusinessDataProps>) => {
      state = action.payload;
      return state;
    },
    updateLogo: (state, action: PayloadAction<string>) => {
      state.logo = action.payload;
      return state;
    },
  },
});

export const { setBusinessData, updateLogo } = BusinessSlice.actions;
export const userState = (state: RootState) => state.business;
export default BusinessSlice.reducer;
