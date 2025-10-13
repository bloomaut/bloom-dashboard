import { createSlice } from "@reduxjs/toolkit";
import { answers } from "@/features/(onboarding)/Questionary/utils/questions";

export const initialState = {
  userId: "",
  answers: answers,
  currentIndex: 0,
};

export const questSlice = createSlice({
  name: "questData",
  initialState,
  reducers: {
    updateQuestData: (state, action) => {
      state.answers[action.payload.index] = action.payload.data;
    },
    setUserId: (state, action) => {
      state.userId = action.payload || "";
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload ?? 0;
    },
    hydrateQuestAnswers: (state, action) => {
      const targetLen = state.answers.length;
      const incoming: string[] = action.payload || [];
      state.answers = Array.from({ length: targetLen }, (_, i) => incoming[i] ?? "");
    },
  },
});

export const { updateQuestData, setUserId, setCurrentIndex, hydrateQuestAnswers } = questSlice.actions;
export default questSlice.reducer;
