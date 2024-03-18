"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Business from "@/routes/Business";
import PopupLogin from "@/components/PopupLogin";
import LoadingSpinner from "@/components/Loading";

function Page() {
  const { user, isLoading } = useUser();
  return <>{!isLoading ? user ? <Business /> : <PopupLogin /> : <LoadingSpinner />}</>;
}

export default Page;
