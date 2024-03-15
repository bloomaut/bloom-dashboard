import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { FilesDataProps } from "@/typescript/interfaces/files.interface";

export const filesInitialData: FilesDataProps = {
  _id: "",
  name: "",
  category: "",
  created_at: "",
  updated_at: "",
  media: [],
};

export const FilesSlice = createSlice({
  name: "filesData",
  initialState: filesInitialData,
  reducers: {
    setFilesData: (state, action: PayloadAction<FilesDataProps>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setFilesData } = FilesSlice.actions;
export const userState = (state: RootState) => state.files;
export default FilesSlice.reducer;
