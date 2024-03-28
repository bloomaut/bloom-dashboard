"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import PopupLogin from "@/components/PopupLogin";
import LoadingSpinner from "@/components/Loading";
import { usePathname } from "next/navigation";
import NewCollectionPage from "@/routes/NewCollection";

export default function Page() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <NewCollectionPage /> : <PopupLogin currentPage={pathname} /> : <LoadingSpinner />}</>;
}
