import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Subdomain } from "@/typescript/interfaces/user.interface";

export const initialState = {
    subdomains: [] as Subdomain[],
};

export const subdomainsSlice = createSlice({
  name: "subdomainsData",
  initialState,
  reducers: {
    setDataSubdomains: (state, action) => {
      state.subdomains = action.payload;
    },
  },
});

export const { setDataSubdomains } = subdomainsSlice.actions;
export const selectSubdomainsData = (state: RootState) => state.subdomainsData;
export default subdomainsSlice.reducer;
