"use client";
import CollectionsPage from "@/routes/Collections";
import { useUser } from "@auth0/nextjs-auth0/client";
import PopupLogin from "@/components/PopupLogin";
import LoadingSpinner from "@/components/Loading";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <CollectionsPage /> : <PopupLogin currentPage={pathname} /> : <LoadingSpinner />}</>;
}
