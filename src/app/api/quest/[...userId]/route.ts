import { PrismaClient } from "@prisma/client";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

const handleGet = withApiAuthRequired(async function handleFetch(req, { params }) {
  if (req.method !== "GET") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    if (!params || !params.userId) {
      return NextResponse.json({ error: "userId parameter is required" }, { status: 400 });
    }

    const userId = params.userId[0] as string;
    console.log(userId);

    const user = await prisma.response.findMany({
      where: {
        clientId: userId,
      },
    });

    let newResponse;

    if (!user || user.length === 0) {
      newResponse = { message: "No user found", userId: userId };
    } else {
      newResponse = user;
    }

    return NextResponse.json(newResponse);
  } catch (error) {
    console.error("----------Error----------", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
});

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("appSession")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_DASH}/api/pipeline/onboarding`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

export const GET = handleGet;
