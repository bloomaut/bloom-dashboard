"use client";
import HomePage from "@/routes/Home";
import SmallLayout from "./(small)/layout";
import { useUser } from "@auth0/nextjs-auth0/client";
import Login from "@/routes/Login";

export default function Home() {
  const { user } = useUser();

  return (
    <>
      {user ? (
        <SmallLayout>
          <HomePage />
        </SmallLayout>
      ) : (
        <Login />
      )}
    </>
  );
}
