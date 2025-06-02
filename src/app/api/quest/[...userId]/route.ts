import { PrismaClient } from "@prisma/client";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

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

    const user = await prisma.response.findFirst({
      where: {
        userId: userId,
      },
    });

    let newResponse;

    if (!user) {
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
export const GET = handleGet;
