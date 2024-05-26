"use client";
import HotlinkPage from "@/routes/Hotlink";
import { useUser } from "@auth0/nextjs-auth0/client";
import PopupLogin from "@/components/PopupLogin";
import LoadingSpinner from "@/components/Loading";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <HotlinkPage /> : <PopupLogin currentPage={pathname} /> : <LoadingSpinner />}</>;
}
