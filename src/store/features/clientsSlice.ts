import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";

export const clientsInitialData: ClientsProps[] = [];

export const ClientsSlice = createSlice({
  name: "clientsData",
  initialState: clientsInitialData,
  reducers: {
    setClientsData: (state, action: PayloadAction<ClientsProps[]>) => {
      return action.payload;
    },
  },
});

export const { setClientsData } = ClientsSlice.actions;
export const clientsState = (state: RootState) => state.clients;
export default ClientsSlice.reducer;
