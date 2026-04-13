type Question = { question: string };

export function buildOnboardingAnswersPayload(questions: Question[], answers: string[]) {
  const out: Record<string, string> = {};
  const len = questions.length;
  for (let i = 0; i < len; i++) {
    const q = questions[i]?.question ?? "";
    const a = answers[i] ?? "";
    out[`${i + 1}. ${q}`] = a;
  }
  return out;
} 

export function stringifyOnboardingAnswersPayload(questions: Question[], answers: string[]) {
  return JSON.stringify(buildOnboardingAnswersPayload(questions, answers));
}
