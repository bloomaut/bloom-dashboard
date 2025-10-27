"use client";
import type React from "react";
import "@/styles/globals.scss";
import { Sidebar } from "./components/SideBar";
import styles from "./styles/backoffice.module.scss";

export default function BackofficeWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.content}>{children}</div>
        </main>
      </div>
    </div>
  );
}
