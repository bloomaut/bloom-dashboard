"use client";
import Business from "@/routes/Business";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

function Page() {
  return <Business />;
}

export default withPageAuthRequired(Page);
