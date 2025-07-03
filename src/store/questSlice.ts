import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { answers } from "@/components/Questionaire/questions";

function extractAnswers(questData: any) {
  const answers: string[] = [];

  questData.forEach((block: any) => {
    block.questions.forEach((questionObj: any) => {
      answers.push(questionObj.answer);
    });
  });

  return answers;
}

export const initialState = {
  userId: "",
  answers: answers,
  terms: false,
  completed: false,
  prop: false,
};

export const questSlice = createSlice({
  name: "questData",
  initialState,
  reducers: {
    setFirstQuestData: (state, action) => {
      console.log("payload", action.payload.completed);
      state.userId = action.payload.answers ? action.payload.userId : action.payload[0].clientId;
      state.answers = action.payload.answers;
      state.terms = action.payload[0] ? action.payload[0].terms : action.payload.terms;
      state.completed = action.payload[0] ? action.payload[0].completed : action.payload.completed;
      state.prop = action.payload[0] ? action.payload[0].prop : action.payload.prop;
    },
    setQuestData: (state, action) => {
      console.log("payload", action.payload.completed);
      state.userId = action.payload.answers ? action.payload.userId : action.payload[0].clientId;
      state.answers =
        extractAnswers(action.payload.answers ? action.payload.answers : action.payload) || initialState.answers;
      state.terms = action.payload[0] ? action.payload[0].terms : action.payload.terms;
      state.completed = action.payload[0] ? action.payload[0].completed : action.payload.completed;
      state.prop = action.payload[0] ? action.payload[0].prop : action.payload.prop;
    },
    setQuestTerms: (state, action) => {
      state.terms = action.payload;
    },
    setQuestCompleted: (state, action) => {
      state.completed = action.payload;
    },
    setPropCompleted: (state, action) => {
      state.prop = action.payload;
    },
    updateQuestData: (state, action) => {
      state.answers[action.payload.index] = action.payload.data;
    },
  },
});

export const { setFirstQuestData, setQuestData, updateQuestData, setQuestTerms, setQuestCompleted, setPropCompleted } =
  questSlice.actions;
export const selectQuestData = (state: RootState) => state;
export default questSlice.reducer;
