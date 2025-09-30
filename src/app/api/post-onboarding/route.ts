import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("appSession")?.value;
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    // Intentar obtener datos del cuerpo de la solicitud
    let requestData = {};
    try {
      const bodyData = await req.json();
      if (bodyData && Object.keys(bodyData).length > 0) {
        requestData = bodyData;
      }
    } catch (e) {
      console.log("No se pudo parsear el cuerpo de la solicitud, usando objeto vacío");
    }

    console.log("Sending request to onboarding API with data:", requestData);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_DASH}/api/pipeline/onboarding`, requestData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 30000, // Aumentado a 30 segundos
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("POST /api/post-onboarding-x error:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);

      // Si hay un mensaje de error específico en la respuesta, lo mostramos
      const errorMessage =
        typeof error.response?.data === "object" && error.response?.data?.message
          ? error.response.data.message
          : error.message;

      return NextResponse.json(
        {
          error: "Error en la API de onboarding",
          status: error.response?.status,
          message: errorMessage,
          details: error.response?.data,
        },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json(
      {
        error: "Error inesperado del servidor",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
