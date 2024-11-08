import { Ricardo } from "@/typescript/interfaces/ricardo.interface";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const initialState = {
  ricardosData: [] as Ricardo[],
  clientId: "",
};

export const ricardoSlice = createSlice({
  name: "ricardoData",
  initialState,
  reducers: {
    setDataRicardos: (state, action) => {
      state.ricardosData = action.payload;
    },
    setClientId: (state, actions) => {
      state.clientId = actions.payload;
    },
  },
});

export const { setDataRicardos, setClientId } = ricardoSlice.actions;
export const selectRicardoData = (state: RootState) => state.ricardosData;
export default ricardoSlice.reducer;
