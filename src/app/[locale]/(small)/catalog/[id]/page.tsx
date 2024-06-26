"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingSpinner from "@/components/Loading";
import CatalogDetail from "@/routes/CatalogDetail";

export default function Page() {
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <CatalogDetail /> : null : <LoadingSpinner />}</>;
}
