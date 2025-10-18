"use client";
import type React from "react";
import "@/styles/globals.scss";
import styles from "./styles/dashboard.module.scss";
import { Sidebar } from "@/features/(dashboard)/components/SideBard/Sidebar";
import SideTrack from "@/features/(dashboard)/components/SideTrack";

export default function DashboardWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.inner_container} id='inner_container'>
      <Sidebar />
      <SideTrack />
      <div className={styles.children_container} id='children_container'>
        {children}
      </div>
    </div>
  );
}
