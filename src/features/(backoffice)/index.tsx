"use client";
import type React from "react";
import "@/styles/globals.scss";
import { Sidebar } from "./components/SideBar";

export default function BackofficeWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`bg-background text-foreground font-sans`}>
      <div className='flex h-screen overflow-hidden'>
        <Sidebar />
        <main className='flex-1 overflow-auto md:ml-64'>
          <div className='p-4 md:p-6 pt-16 md:pt-6'>{children}</div>
        </main>
      </div>
    </div>
  );
}
