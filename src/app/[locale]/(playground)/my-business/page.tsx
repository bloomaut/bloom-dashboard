"use client";
import Business from "@/routes/Business";
import LoadingSpinner from "@/components/Loading";
import { useUser } from "@auth0/nextjs-auth0/client";

function Page() {
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <Business /> : null : <LoadingSpinner />}</>;
}

export default Page;
