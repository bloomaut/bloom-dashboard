"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import PopupLogin from "@/components/PopupLogin";
import LoadingSpinner from "@/components/Loading";
import { usePathname } from "next/navigation";
import GalleryPage from "@/routes/Gallery";

export default function Page() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <GalleryPage /> : <PopupLogin currentPage={pathname} /> : <LoadingSpinner />}</>;
}
