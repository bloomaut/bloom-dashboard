"use client";
import HomePage from "@/routes/Home";
import SmallLayout from "./(small)/layout";
import Login from "@/routes/Login";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingMsg from "@/components/Loading";

export default function Home() {
  const { user, isLoading, error } = useUser();

  if (isLoading) return <LoadingMsg home={true} />;
  if (error) return <div>Error de autenticación: {error.message}</div>;
  if (user) {
    return (
      <SmallLayout>
        <HomePage />
      </SmallLayout>
    );
  }

  return <Login />;
}
