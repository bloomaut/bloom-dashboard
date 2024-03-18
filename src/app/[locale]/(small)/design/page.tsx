"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import PopupLogin from "@/components/PopupLogin";
import LoadingSpinner from "@/components/Loading";

function Page() {
  const { user, isLoading } = useUser();
  return <>{!isLoading ? user ? <h1>Design Page</h1> : <PopupLogin /> : <LoadingSpinner />}</>;
}

export default Page;
