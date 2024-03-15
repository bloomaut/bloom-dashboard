"use client";
import BusinessOld from "@/routes/BusinessOld";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

function Page() {
  return <BusinessOld />;
}

export default withPageAuthRequired(Page);
