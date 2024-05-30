"use client";
import CatalogPage from "@/routes/Catalog";
import LoadingSpinner from "@/components/Loading";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import PopupLogin from "@/components/PopupLogin";

export default function Page() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <CatalogPage /> : <PopupLogin currentPage={pathname} /> : <LoadingSpinner />}</>;
}
