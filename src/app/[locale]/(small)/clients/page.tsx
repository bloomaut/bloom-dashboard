"use client";
import ClientsPage from "@/routes/Clients";
import LoadingSpinner from "@/components/Loading";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Page() {
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <ClientsPage /> : null : <LoadingSpinner />}</>;
}
