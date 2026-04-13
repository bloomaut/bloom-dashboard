"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Settings } from "lucide-react";
import styles from "./styles.module.scss";
import { useAppDispatch } from "@/store/hooks";
import { clearUserData } from "@/store/features/userSlice";
import { useParams } from "next/navigation";

export default function Config() {
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
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Settings className={styles.headerIconSvg} />
            </div>
            <div>
              <h1 className={styles.headerTitle}>Configuración</h1>
              <p className={styles.headerSubtitle}>Ajustes y configuración del sistema</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>Panel en desarrollo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={styles.mutedText}>
              Esta sección está en construcción. Mientras tanto, podés cerrar sesión desde aquí.
            </p>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-start" }}>
              <button onClick={handleLogout} className={styles.logoutButton} type='button'>
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
