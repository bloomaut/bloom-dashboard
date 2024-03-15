"use client";
import Business2 from "@/routes/Business2";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

function Page() {
  return <Business2 />;
}

export default withPageAuthRequired(Page);
