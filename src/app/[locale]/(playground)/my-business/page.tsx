"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Business from "@/routes/Business";
import PopupLogin from "@/components/PopupLogin";
import LoadingSpinner from "@/components/Loading";
import { usePathname } from "next/navigation";

function Page() {
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  return <>{!isLoading ? user ? <Business /> : <PopupLogin currentPage={pathname} /> : <LoadingSpinner />}</>;
}

export default Page;
