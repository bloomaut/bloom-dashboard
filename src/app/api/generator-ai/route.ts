import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import axios from "axios";

const handleRequest = withApiAuthRequired(async function handleFetch(req) {
  if (req.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const data = new FormData();
    data.append("file", file);

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_CONVERSATION}/api/datasets/generator-ai`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("----------Axios Error----------", error.response?.data);
      return NextResponse.json({ error: error.response?.data?.message }, { status: error.response?.status || 500 });
    } else {
      console.error("----------Other Error----------", error);
      return NextResponse.json({ error: error || "Internal Server Error" }, { status: 500 });
    }
  }
});

export const POST = handleRequest;
