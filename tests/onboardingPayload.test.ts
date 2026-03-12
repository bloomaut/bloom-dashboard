import { describe, expect, it } from "vitest";
import { buildOnboardingAnswersPayload, stringifyOnboardingAnswersPayload } from "@/lib/onboardingPayload";

describe("onboarding payload", () => {
  it("mapea preguntas a respuestas con numeración", () => {
    const questions = [{ question: "¿Cómo te llamás?" }, { question: "¿Qué vendés?" }];
    const answers = ["Sofi", "Tortas"];

    const payload = buildOnboardingAnswersPayload(questions, answers);
    expect(payload).toEqual({
      "1. ¿Cómo te llamás?": "Sofi",
      "2. ¿Qué vendés?": "Tortas",
    });
  });

  it("stringify produce JSON válido", () => {
    const questions = [{ question: "A" }];
    const answers = ["B"];
    const s = stringifyOnboardingAnswersPayload(questions, answers);
    expect(JSON.parse(s)).toEqual({ "1. A": "B" });
  });
});
