"use client";
import ClientsPage from "@/routes/Clients";
import PopupLogin from "@/components/PopupLogin";
import LoadingSpinner from "@/components/Loading";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <ClientsPage /> : <PopupLogin currentPage={pathname} /> : <LoadingSpinner />}</>;
}
