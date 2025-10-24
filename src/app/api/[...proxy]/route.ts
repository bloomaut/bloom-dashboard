import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosRequestConfig } from "axios";

const handleRequest = withApiAuthRequired(async function handleFetch(req: NextRequest) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);

    console.log("My Access Token:", accessToken);

    const path = req.nextUrl.pathname.substring(req.nextUrl.pathname.indexOf("/api"));

    const apiName = req.headers.get("X-API") || "";
    const EXTERNAL_API_URL = apiName ? process.env[apiName] : process.env.NEXT_PUBLIC_API_DASH;

    if (!EXTERNAL_API_URL) {
      throw new Error("No API base found");
    }

    // No inyectar client_id como query parameter
    const searchParams = new URLSearchParams(req.nextUrl.search);

    // Reconstruimos la URL con el query param inyectado
    const fullUrl = `${EXTERNAL_API_URL}${path}?${searchParams.toString()}`;

    const fetchOptions: AxiosRequestConfig = {
      method: req.method.toLowerCase(),
      url: fullUrl,
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    if (["POST", "PUT", "PATCH"].includes(req.method) && req?.body) {
      const contentType = req.headers.get("Content-Type");

      if (contentType) {
        if (contentType.includes("multipart/form-data")) {
          const data = await req?.formData();
          fetchOptions.data = data;
        } else if (contentType.includes("application/json")) {
          const jsonData = await req?.json();
          fetchOptions.data = jsonData;
          console.log("JSON que envio:", jsonData);
        }
      }
    }

    console.log("Request Options:", fetchOptions);

    const { data } = await axios(fetchOptions);
    return NextResponse.json({ data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("----------Axios Error----------", error.response?.data);
      return NextResponse.json({ error: error.response?.data?.message }, { status: error.response?.status || 500 });
    } else {
      // Handle other types of errors here
      console.error("----------Other Error----------", error);
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
});

export const GET = handleRequest;
export const PUT = handleRequest;
export const POST = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
