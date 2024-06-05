"use client";
import LoadingSpinner from "@/components/Loading";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import PopupLogin from "@/components/PopupLogin";
import CatalogDetail from "@/routes/CatalogDetail";

export default function Page() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <CatalogDetail /> : <PopupLogin currentPage={pathname} /> : <LoadingSpinner />}</>;
}
