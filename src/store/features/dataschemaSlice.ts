import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { DataschemaProps } from "@/typescript/interfaces/catalog.interface";

export const dataschemaInitialData: Array<DataschemaProps> = [];

export const DataschemaSlice = createSlice({
  name: "dataschemaData",
  initialState: dataschemaInitialData,
  reducers: {
    setDataschemaData: (state, action: PayloadAction<Array<DataschemaProps>>) => {
      return action.payload;
    },
  },
});

export const { setDataschemaData } = DataschemaSlice.actions;
export const dataschemaState = (state: RootState) => state.dataschema;
export default DataschemaSlice.reducer;
