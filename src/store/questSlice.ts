import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

function extractAnswers(questData: any) {
  const answers: string[] = [];

  questData.forEach((block: any) => {
    console.log("block", block);
    block.questions.forEach((questionObj: any) => {
      answers.push(questionObj.answer);
    });
  });

  return answers;
}

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
      console.log("payload", action.payload.completed);
      state.userId = action.payload.answers ? action.payload.userId : action.payload[0].clientId;
      state.answers =
        extractAnswers(action.payload.answers ? action.payload.answers : action.payload) || initialState.answers;
      state.completed = action.payload[0] ? action.payload[0].completed : action.payload.completed;
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
