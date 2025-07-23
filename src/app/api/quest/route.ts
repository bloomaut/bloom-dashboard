import { PrismaClient } from "@prisma/client";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import axios from "axios";

const prisma = new PrismaClient();

const handleRequest = withApiAuthRequired(async function handleFetch(req) {
  const body = await req.json();

  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    const { userId, answers, completed } = body;
    const user = await prisma.questionStepper.findFirst({
      where: {
        clientId: userId,
      },
    });
    let newResponse;

    if (!user) {
      newResponse = await prisma.questionStepper.createMany({
        data: answers.map((answer: any) => ({
          block: answer.block,
          clientId: userId,
          questions: answer.questions,
          terms: answer.terms,
          completed: completed,
        })),
      });
    } else {
      await prisma.questionStepper.deleteMany({
        where: {
          clientId: userId,
        },
      });

      const createdResponses = await prisma.questionStepper.createMany({
        data: answers.map((answer: any) => ({
          block: answer.block,
          clientId: userId,
          questions: answer.questions,
          terms: answer.terms,
          completed: completed,
        })),
      });
      return NextResponse.json(createdResponses);
    }

    return NextResponse.json(newResponse);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("----------Axios Error----------", error.response?.data);
      return NextResponse.json({ Error: error });
    } else {
      console.error("----------Other Error----------", error);
      return NextResponse.json({ Error2: error });
    }
  }
});

export const POST = handleRequest;
