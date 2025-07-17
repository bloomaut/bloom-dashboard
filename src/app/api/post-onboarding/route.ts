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

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_DASH}/api/pipeline/onboarding`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("POST /api/post-onboarding error:", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data || "Upstream API error" },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
