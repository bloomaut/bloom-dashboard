"use client";
import InboxPage from "@/routes/Inbox";
import { useUser } from "@auth0/nextjs-auth0/client";
import PopupLogin from "@/components/PopupLogin";
import LoadingSpinner from "@/components/Loading";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <InboxPage /> : <PopupLogin currentPage={pathname} /> : <LoadingSpinner />}</>;
}
