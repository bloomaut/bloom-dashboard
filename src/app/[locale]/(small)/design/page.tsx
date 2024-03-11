"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

function Page() {
  return <h1>Design Page</h1>;
}

export default withPageAuthRequired(Page);
