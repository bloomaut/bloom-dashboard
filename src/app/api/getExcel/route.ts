import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ENV } from "@/typescript/types/environment.enum";

const handleRequest = withApiAuthRequired(async function handleFetch(req: NextRequest) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);
    const apiId = req.headers.get("X-ID") || "";

    // XLXS requests
    const resp = await fetch(`${process.env[ENV.DASH]}/api/client-customer/flakes/powerapp/${apiId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const blob = await resp.blob();
    const headers = new Headers();
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return new NextResponse(blob, { status: 200, statusText: "OK", headers });
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
