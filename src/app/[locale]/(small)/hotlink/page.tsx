"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import HotlinkPage from "@/routes/Hotlink";
import LoadingSpinner from "@/components/Loading";

export default function Page() {
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <HotlinkPage /> : null : <LoadingSpinner />}</>;
}
