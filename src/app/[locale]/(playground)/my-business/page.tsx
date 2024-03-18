"use client";
import Business from "@/routes/Business";
import { useState } from "react";
import PopupLogin from "@/components/PopupLogin";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingSpinner from "@/components/Loading";

function Page() {
  const [showPopup, setShowPopup] = useState(false);
  const { user, isLoading } = useUser();
  return <>{!isLoading ? user ? <Business /> : <PopupLogin setShowPopup={setShowPopup} /> : <LoadingSpinner />}</>;
}

export default Page;
