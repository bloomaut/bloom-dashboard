export const runtime = "nodejs";

import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import { SpeechClient } from "@google-cloud/speech";

function parsePrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

const hardKey =
  "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQD4zMxYNj+88RRK\nyem8h9KfK/J/9yAoHRM6KHLWizeI7j95kNrI0rIeOOc9DFVansm4p0PLvYOPE1t3\nXpazed5Do5eBpBj4ko5YHOACVkQ5mrAH2aI1bt1Va9vnBUdCEUztcsFibariLQVw\ng5bu9jQyomjN9YLvue43d/9CHpuYMt+OdEhi+BpcWt3kMOxcHHa3JKlIozi3Hkg1\nDmMsHQEcTY547QaHFYOmrHwpwejDoTelujIIXBgNFqE5QV+06Rv68I2p6/gNj1+5\nqSXl9ftqHT1sVPyOzmtRANMm6GWlM8efnSUPQRyNCRT3B3TsnARt4AVshUQAYigi\nNEC0sGmVAgMBAAECggEAC+yc2pl3ApI3W8JDnpKP6KsNi06HzwRduIrZviib98cb\nabMkmT1n5gTqKEXgDWDQ4DW8DRa/KGtQFe+Fn4J2wZ0klMUNoVQ82EJCBjqmOHCO\ngUHQAWmX2BE8T90z5hm4KyU12YbSCtcHjLXx1PAd3lNkXIKozN6HaUcqB7w5ztiB\nJ04GyGnB0tUQcVWVkzPtSPBuNY5i+Ymfcqe8oCyup/dPyj3pjRrCurkXE5ytOQP3\nBbgQ9uvHCIbQiMF6sINEXYXRkSeygzFFdGrz6nifJ7OfuVTUMgUCaZ5/K1sQukKL\nSKIlZvh9nE7N4EPqsNaflzPAJDAQMS01SYSihMimwQKBgQD9xZ//TFWy80us5m0n\nrxNyHClr98Qjz9G1hK8g/Aixnyt8rPbf9nr2FYfnhCT8W4pHeFI9+JbZCHRlFPBO\nvxL8hDx6sK4YoKK7JtrBqdPhdwr+LiEN6BlVtotGElUUsgIrVL2MdKIFk0CodTVE\n3hF4u31wkmV5kkHfrMoVNr+2ZQKBgQD6+/+OaVDM6is0tTmg6eB4rRkjj+fsE6tc\noUdv1ighJHX0p7eSzJB1z2z4rM4qIRXgJaf1crxduEcxAtFlj43XBmCwhT3mXLkU\nlWGO6GLYUD8zrFl2SLfR/IOrFdxBHKgSNmGXC8GEnP+/zBY+/eOX2t03DCZxaOCX\ndQN5Nh9bcQKBgEdeT9vdnPBhyfOLLkGN1DswPln16TxlEsYo1ZPCLbO+Xt2GSzu7\nNuOENJ9go4IxQFdPOFnjUpEg9pMC635J8E4B5nxeueeFLZ7Sk40JdOQgtX+8e2FM\n1+sqFksTlsfmNAP5pgEdP/+vZOy7YcrHZUR9/g4trcod3tbH4mFK72mdAoGAXxcm\nxdAE+v4ljHy07tBtaYs7oQuetQTmwdug8zBSV+w2fJEmrgmvGdOS18yw96k9XoUl\n04q6708oOdt1dmMjPDqAW6C/yQ2MWc4W/kvxVz9gErXT10rJylc/k4xevJSc4PmV\nk+KyWQoao5IxQ4BxwFD9yyNhVUqE/R0qSbxFuSECgYA2n7FQTy3FliVq0B8v+zo+\nMuz90OADUBYvqvlI9Q7mg8+JqkU9/H6k/l5qyhQLvoLOKZm1f41cTVzmtmx26aY4\nCV/R5/iDpKHWWB72HtC3tGKr8ZI8aJlw/h3yCYijM1po8YD/oGBtw1nGR7uUx561\nKs8P8KKH0MHe7y5nrsUs0g==\n-----END PRIVATE KEY-----\n";

const speechClient = new SpeechClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: "speech-to-text-service@small-transcription.iam.gserviceaccount.com",
    private_key: hardKey,
  },
});

const handleRequest = withApiAuthRequired(async function handleTranscribe(req: NextRequest) {
  try {
    console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
    console.log("GOOGLE_PRIVATE_KEY exists:", Boolean(process.env.GOOGLE_PRIVATE_KEY));
    console.log("GOOGLE_PRIVATE_KEY length:", process.env.GOOGLE_PRIVATE_KEY?.length);
    console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);

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
