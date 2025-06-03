import { PrismaClient } from "@prisma/client";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import axios from "axios";

const prisma = new PrismaClient();

const handleRequest = withApiAuthRequired(async function handleFetch(req) {
  console.log("Post");
  const body = await req.json();
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    const { userId, answers, terms, completed } = body;

    const user = await prisma.response.findFirst({
      where: {
        userId: userId,
      },
    });

    let newResponse;

    if (!user) {
      newResponse = await prisma.response.create({
        data: {
          userId,
          answers,
          terms,
          completed,
        },
      });
    } else {
      newResponse = await prisma.response.update({
        where: {
          id: user.id,
        },
        data: {
          answers,
          terms,
          completed,
        },
      });
    }

    return NextResponse.json(newResponse);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("----------Axios Error----------", error.response?.data);
      return NextResponse.json("Error");
    } else {
      console.error("----------Other Error----------", error);
      return NextResponse.json("Error2");
    }
  }
});

export const POST = handleRequest;
