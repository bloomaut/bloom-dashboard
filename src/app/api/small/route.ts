import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosRequestConfig } from "axios";

const handleRequest = async function handleFetch(req: NextRequest) {
  try {
    const fetchOptions: AxiosRequestConfig = {
      method: req.method.toLowerCase(),
      url: `${process.env.NEXT_PUBLIC_API_UITOOL}/api/small/${req.nextUrl.search}`,
    };

    console.log(fetchOptions);

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
};

export const GET = handleRequest;
