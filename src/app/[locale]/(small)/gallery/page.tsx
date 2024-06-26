"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingSpinner from "@/components/Loading";
import GalleryPage from "@/routes/Gallery";

export default function Page() {
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <GalleryPage /> : null : <LoadingSpinner />}</>;
}
