"use client";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import styles from "./styles.module.scss";
import { useAppDispatch } from "@/store/hooks";
import { clearUserData } from "@/store/features/userSlice";
import { useParams } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

function LayoutWrapper({ children, title, description, breadcrumbs }: LayoutWrapperProps) {
  const dispatch = useAppDispatch();
  const { locale } = useParams() as { locale?: string };

  const handleLogout = () => {
    // Limpiar datos del usuario en Redux
    dispatch(clearUserData());

    // Limpiar cookies de sesión
    document.cookie = "app-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
    document.cookie = "onboarding=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";

    // Limpiar localStorage
    localStorage.removeItem("client_id");

    // Redirigir a Auth0 logout
    window.location.href = `/api/auth/logout?returnTo=${window.location.origin}/${locale || "es"}`;
  };

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.centerContent}>
        <div className={styles.developmentMessage}>Panel de configuracion en desarrollo.</div>
        <button onClick={handleLogout} className={styles.logoutButton} type='button'>
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default function Config() {
  return (
    <LayoutWrapper
      title='Configuración'
      description='Ajustes y configuración del sistema'
      breadcrumbs={[{ label: "Configuración" }]}
    >
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Configuración del Sistema</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <p className={styles.mutedText}>Panel de configuración en desarrollo.</p>
        </CardContent>
      </Card>
    </LayoutWrapper>
  );
}
