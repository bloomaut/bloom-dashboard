export const runtime = "nodejs";

import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { SpeechClient } from "@google-cloud/speech";

const speechClient = new SpeechClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const handleRequest = withApiAuthRequired(async function handleTranscribe(req: NextRequest) {
  try {
    console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
    console.log("GOOGLE_PRIVATE_KEY exists:", Boolean(process.env.GOOGLE_PRIVATE_KEY));
    console.log("GOOGLE_PRIVATE_KEY length:", process.env.GOOGLE_PRIVATE_KEY?.length);

    const res = new NextResponse();
    await getAccessToken(req, res);

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const questionIndex = formData.get("questionIndex") as string | null;

    if (!audioFile) {
      console.warn("No audio file provided");
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Audio file size (bytes):", buffer.length);

    const speechRequest = {
      audio: {
        content: buffer.toString("base64"),
      },
      config: {
        audioChannelCount: 1,
        encoding: "WEBM_OPUS" as const,
        sampleRateHertz: 48000,
        languageCode: "es-ES",
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: false,
        model: "default",
      },
    };

    let response;
    try {
      [response] = await speechClient.recognize(speechRequest);
      console.log("Google Speech API response:", JSON.stringify(response, null, 2));
    } catch (gError) {
      console.error("Google Speech API error:", gError);
      return NextResponse.json({ error: "Google Speech API failed", success: false }, { status: 500 });
    }

    const transcription = response.results?.map(result => result.alternatives?.[0]?.transcript).join("\n") || "";

    const confidence = response.results?.[0]?.alternatives?.[0]?.confidence || 0;

    return NextResponse.json({
      transcription,
      confidence,
      questionIndex: parseInt(questionIndex || "0"),
      success: true,
    });
  } catch (error: any) {
    console.error("Unhandled error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Internal transcription error",
        success: false,
      },
      { status: 500 },
    );
  }
});

export const POST = handleRequest;
