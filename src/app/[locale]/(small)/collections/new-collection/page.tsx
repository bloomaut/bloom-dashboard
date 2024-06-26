"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingSpinner from "@/components/Loading";
import NewCollectionPage from "@/routes/NewCollection";

export default function Page() {
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <NewCollectionPage /> : null : <LoadingSpinner />}</>;
}
