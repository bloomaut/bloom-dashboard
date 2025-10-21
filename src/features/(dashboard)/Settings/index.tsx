"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Phone, Calendar, Shield } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { userState, clearUserData } from "@/store/features/userSlice";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./styles/styles.module.scss";

const SettingsPage = () => {
  const userData = useAppSelector(userState);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { locale } = useParams() as { locale?: string };
  const dict = useTranslations("dict.settings");

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

  const formatDate = (dateString: string) => {
    if (!dateString) return dict("fields.not_available");
    return new Date(dateString).toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.settings_container}>
      <div className={styles.header_section}>
        <div className={styles.header_content}>
          <h1 className={styles.page_title}>{dict("header.title")}</h1>
          <p className={styles.page_description}>{dict("header.description")}</p>
        </div>
      </div>

      {/* Información del Usuario */}
      <Card className={styles.settings_card}>
        <CardHeader className={styles.card_header}>
          <CardTitle className={styles.card_title}>
            <User className={styles.title_icon} />
            {dict("sections.personal_info")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.user_info_grid}>
            <div className={styles.info_field}>
              <label className={styles.field_label}>
                <User className={styles.label_icon} />
                {dict("fields.name")}
              </label>
              <p className={styles.field_value}>{userData.name || dict("fields.not_specified")}</p>
            </div>

            <div className={styles.info_field}>
              <label className={styles.field_label}>
                <User className={styles.label_icon} />
                {dict("fields.lastname")}
              </label>
              <p className={styles.field_value}>{userData.lastname || dict("fields.not_specified")}</p>
            </div>

            <div className={styles.info_field}>
              <label className={styles.field_label}>
                <Mail className={styles.label_icon} />
                {dict("fields.email")}
              </label>
              <p className={styles.field_value}>{userData.email || dict("fields.not_specified")}</p>
            </div>

            <div className={styles.info_field}>
              <label className={styles.field_label}>
                <Phone className={styles.label_icon} />
                {dict("fields.phone")}
              </label>
              <p className={styles.field_value}>{userData.phone || dict("fields.not_specified")}</p>
            </div>

            <div className={styles.info_field}>
              <label className={styles.field_label}>
                <Shield className={styles.label_icon} />
                {dict("fields.role")}
              </label>
              <p className={styles.field_value}>{userData.role || dict("roles.user")}</p>
            </div>

            <div className={styles.info_field}>
              <label className={styles.field_label}>
                <Calendar className={styles.label_icon} />
                {dict("fields.registration_date")}
              </label>
              <p className={styles.field_value}>{formatDate(userData.created_at || "")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones de Cuenta */}
      <Card className={styles.settings_card}>
        <CardHeader className={styles.card_header}>
          <CardTitle className={styles.card_title}>{dict("sections.account_actions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.actions_section}>
            <button className={styles.logout_button} onClick={handleLogout}>
              <LogOut className={styles.button_icon} />
              {dict("actions.logout")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
