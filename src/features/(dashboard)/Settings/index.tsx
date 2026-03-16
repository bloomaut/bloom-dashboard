"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Phone, Calendar, FileText } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUserData, userState, clearUserData } from "@/store/features/userSlice";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { get, patchUserProfile } from "@/services/fetch";
import { extractUserFromMeResponse } from "@/lib/userMe";
import styles from "./styles/styles.module.scss";

const SettingsPage = () => {
  const userData = useAppSelector(userState);
  const dispatch = useAppDispatch();
  const { locale } = useParams() as { locale?: string };
  const dict = useTranslations("dict.settings");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const initialForm = useMemo(
    () => ({
      name: userData.name || "",
      lastname: userData.lastname || "",
      phone: userData.phone || "",
    }),
    [userData.name, userData.lastname, userData.phone],
  );
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isEditing) setForm(initialForm);
  }, [initialForm, isEditing]);

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

  const subscriptionLabel = (() => {
    const raw = String(userData.suscription || "").trim();
    if (!raw) return dict("fields.not_available");
    if (raw.toLowerCase() === "free") return "Plan Base";
    return raw;
  })();

  const updateField = (key: "name" | "lastname" | "phone", value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setFormError(null);
    setFormSuccess(null);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setFormError(null);
    setFormSuccess(null);

    const normalize = (v: string) => v.trim();
    const payload: { name?: string; lastname?: string; phone?: string } = {};

    const nextName = normalize(form.name);
    const nextLastname = normalize(form.lastname);
    const nextPhone = normalize(form.phone);

    if (nextName !== normalize(initialForm.name)) payload.name = nextName;
    if (nextLastname !== normalize(initialForm.lastname)) payload.lastname = nextLastname;
    if (nextPhone !== normalize(initialForm.phone)) payload.phone = nextPhone;

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      const res = await patchUserProfile(payload);
      if ((res as any)?.statusCode && (res as any).statusCode !== 200) {
        throw new Error(String((res as any)?.message || "Error"));
      }

      const me = await get("user/me");
      const freshUser = extractUserFromMeResponse(me);
      if (freshUser) dispatch(setUserData(freshUser));

      setIsEditing(false);
      setFormSuccess("Cambios guardados");
    } catch (e: any) {
      setFormError(e?.message || "No se pudieron guardar los cambios");
    } finally {
      setIsSaving(false);
    }
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
          <div className={styles.cardHeaderRow}>
            <CardTitle className={styles.card_title}>
              <User className={styles.title_icon} />
              {dict("sections.personal_info")}
            </CardTitle>
            <div className={styles.profileActions}>
              {isEditing ? (
                <>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className='border-primary bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                  >
                    Cancelar
                  </Button>
                  <Button size='sm' onClick={handleSave} disabled={isSaving} className='shadow-sm'>
                    Guardar
                  </Button>
                </>
              ) : (
                <Button size='sm' onClick={() => setIsEditing(true)} className='shadow-sm'>
                  Editar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {(formError || formSuccess) && (
            <div className={styles.formMessage}>
              {formError && <div className={styles.formError}>{formError}</div>}
              {formSuccess && <div className={styles.formSuccess}>{formSuccess}</div>}
            </div>
          )}
          <div className={styles.user_info_grid}>
            <div className={styles.info_field}>
              <label className={styles.field_label}>
                <User className={styles.label_icon} />
                {dict("fields.name")}
              </label>
              {isEditing ? (
                <input
                  className={styles.field_input}
                  value={form.name}
                  onChange={e => updateField("name", e.target.value)}
                  disabled={isSaving}
                />
              ) : (
                <p className={styles.field_value}>{userData.name || dict("fields.not_specified")}</p>
              )}
            </div>

            <div className={styles.info_field}>
              <label className={styles.field_label}>
                <User className={styles.label_icon} />
                {dict("fields.lastname")}
              </label>
              {isEditing ? (
                <input
                  className={styles.field_input}
                  value={form.lastname}
                  onChange={e => updateField("lastname", e.target.value)}
                  disabled={isSaving}
                />
              ) : (
                <p className={styles.field_value}>{userData.lastname || dict("fields.not_specified")}</p>
              )}
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
              {isEditing ? (
                <input
                  className={styles.field_input}
                  type='tel'
                  value={form.phone}
                  onChange={e => updateField("phone", e.target.value)}
                  disabled={isSaving}
                />
              ) : (
                <p className={styles.field_value}>{userData.phone || dict("fields.not_specified")}</p>
              )}
            </div>

            <div className={styles.info_field}>
              <label className={styles.field_label}>
                <FileText className={styles.label_icon} />
                Suscripción
              </label>
              <p className={styles.field_value}>{subscriptionLabel}</p>
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
