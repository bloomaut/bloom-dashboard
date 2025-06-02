import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const initialState = {
  userId: "",
  answers: ["", "", "", "", "", "", "", "", "", ""],
  completed: false,
};

export const questSlice = createSlice({
  name: "questData",
  initialState,
  reducers: {
    setQuestData: (state, action) => {
      state.userId = action.payload.userId;
      state.answers = action.payload.answers;
      state.completed = action.payload.completed;
    },
    updateQuestData: (state, action) => {
      state.answers[action.payload.index] = action.payload.data;
    },
  },
});

export const { setQuestData, updateQuestData } = questSlice.actions;
export const selectQuestData = (state: RootState) => state;
export default questSlice.reducer;
