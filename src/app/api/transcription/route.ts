import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { SpeechClient } from "@google-cloud/speech";

// Initialize the Speech client with your service account
const speechClient = new SpeechClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const handleRequest = withApiAuthRequired(async function handleTranscribe(req: NextRequest) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const questionIndex = formData.get("questionIndex") as string;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const audioConfig = {
      audioChannelCount: 1,
      encoding: "WEBM_OPUS" as const,
      sampleRateHertz: 48000,
      languageCode: "es-ES",
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: false,
      model: "default",
    };

    const speechRequest = {
      audio: {
        content: buffer.toString("base64"),
      },
      config: audioConfig,
    };

    const [response] = await speechClient.recognize(speechRequest);

    const transcription = response.results?.map(result => result.alternatives?.[0]?.transcript).join("\n") || "";

    const confidence = response.results?.[0]?.alternatives?.[0]?.confidence || 0;

    return NextResponse.json({
      transcription,
      confidence,
      questionIndex: parseInt(questionIndex),
      success: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("----------Axios Error----------", error.response?.data);
      return NextResponse.json(
        {
          error: error.response?.data?.message || "Transcription failed",
          success: false,
        },
        { status: error.response?.status || 500 },
      );
    } else if (error instanceof Error) {
      console.error("----------Transcription Error----------", error.message);
      return NextResponse.json(
        {
          error: error.message || "Failed to transcribe audio",
          success: false,
        },
        { status: 500 },
      );
    } else {
      console.error("----------Other Error----------", error);
      return NextResponse.json(
        {
          error: "Internal server error during transcription",
          success: false,
        },
        { status: 500 },
      );
    }
  }
});

export const POST = handleRequest;
