import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosRequestConfig } from "axios";

const handleRequest = withApiAuthRequired(async function handleFetch(req: NextRequest) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);

    console.log("My Access Token:", accessToken);

    const path = req.nextUrl.pathname.substring(req.nextUrl.pathname.indexOf("/api"));
    const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_API_BASE;

    const fetchOptions: AxiosRequestConfig = {
      method: req.method.toLowerCase(),
      url: `${EXTERNAL_API_URL}${path}${req.nextUrl.search}`,
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

    const { data } = await axios(fetchOptions);
    return NextResponse.json({ data });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("----------Axios Error----------", error.response?.data);
      return NextResponse.json({ error: error.response?.data?.message }, { status: error.response?.status || 500 });
    } else {
      // Handle other types of errors here
      console.error("----------Other Error----------", error);
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
  }
});

export const GET = handleRequest;
export const PUT = handleRequest;
export const POST = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
