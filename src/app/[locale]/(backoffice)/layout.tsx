import "@/styles/globals.scss";
import styles from "./layout.module.scss";
import type { Metadata } from "next";
import BackofficeWrapper from "@/features/(backoffice)";
import AdminGuard from "@/features/(backoffice)/guards/AdminGuard";

export const metadata: Metadata = {
  title: "Backoffice Admin",
  description: "Panel administrativo para gestión de usuarios y métricas",
  generator: "v0.app",
};

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <AdminGuard>
        <BackofficeWrapper>{children}</BackofficeWrapper>
      </AdminGuard>
    </div>
  );
}
