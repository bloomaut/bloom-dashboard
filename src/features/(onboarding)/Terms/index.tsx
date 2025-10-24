"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { update, get } from "@/services/fetch";
import { setUserData } from "@/store/features/userSlice";
import styles from "./styles.module.scss";

export default function Terms() {
  const [term, setTerm] = useState(false);
  const dict = useTranslations("dict.terms");

  const user = useAppSelector(state => state.userData);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const handleTerms = async () => {
    if (!term || loading) return;

    const clientId = user?.client?.id;
    if (!clientId) {
      console.error("Client ID no disponible en userData");
      return;
    }

    try {
      setLoading(true);
      await update("user", {
        client: {
          id: clientId,
          proposal_status: "terms_accepted",
        },
      });

      const resUser = await get("user/me");
      console.log("resUser:", resUser);
      if (resUser?.statusCode === 200 && resUser?.result?.user) {
        dispatch(setUserData(resUser.result.user));
      }

      router.replace(`/${locale}/onboarding/questionary`);
    } catch (error) {
      console.error("Error al aceptar términos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.headingGroup}>
          <h2 className={styles.title}>{dict("title")}</h2>
          <p className={styles.subtitle}>{dict("subtitle")}</p>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.videoColumn}>
            <div className={styles.videoWrapper}>
              <div className={styles.videoBox}>{/* Reemplaza este div por tu iframe si lo necesitas */}</div>
            </div>
          </div>

          <div className={styles.controlsColumn}>
            <div className={styles.termsRow}>
              <input
                type='checkbox'
                id='term'
                name='term'
                className={styles.checkboxInput}
                onChange={() => setTerm(!term)}
              />
              <label htmlFor='term' className={styles.checkboxLabel}>
                <span className={styles.checkmark}></span>
              </label>

              <span className={styles.termsText}>
                {dict("checkbox_text")}{" "}
                <a href={`/${locale}/policy`} target='_blank' rel='noreferrer' className={styles.termsLink}>
                  {dict("terms_link")}
                </a>{" "}
                {dict("checkbox_suffix")}
              </span>
            </div>

            <button
              className={`${styles.buttonContinue} ${term && !loading ? styles.buttonEnabled : ""}`}
              onClick={() => {
                if (!term || loading) return;
                handleTerms();
              }}
              disabled={!term || loading}
              aria-busy={loading}
            >
              {loading ? dict("processing") : dict("continue_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
