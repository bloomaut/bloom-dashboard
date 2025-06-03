import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const initialState = {
  userId: "",
  answers: ["", "", "", "", "", "", "", "", "", ""],
  terms: false,
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
    setQuestTerms: (state, action) => {
      state.terms = action.payload;
    },
    updateQuestData: (state, action) => {
      state.answers[action.payload.index] = action.payload.data;
    },
  },
});

export const { setQuestData, updateQuestData, setQuestTerms } = questSlice.actions;
export const selectQuestData = (state: RootState) => state;
export default questSlice.reducer;
