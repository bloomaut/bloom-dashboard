"use client";
import { Download, HelpCircle, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { styles } from "./styles";
import { approveProposal, get } from "@/services/fetch";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUserData } from "@/store/features/userSlice";
import { useLocale } from "next-intl";

function ProposalActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict.proposal");
  const locale = useLocale();
  const user = useAppSelector(state => state.userData);
  const [checked, setChecked] = useState(false);

  const handleClick = async () => {
    try {
      // Aprobar la propuesta
      await approveProposal();

      // Actualizar los datos del usuario para reflejar el cambio
      const resUser = await get("user/me");
      if (resUser.statusCode === 200) {
        dispatch(setUserData(resUser.result.user));
      }

      router.push("/");
    } catch (error) {
      console.error("Error al aprobar propuesta:", error);
    }
  };

  const handleFeedbackClick = () => {
    const userId = user?.client?.id || user?.id || "unknown";

    // Contenido del email según el idioma
    const emailContent =
      locale === "es"
        ? {
            subject: `Pedido de apelación de propuesta ${userId}`,
            body: `Estimado equipo de Bloom,

Espero que se encuentren bien. Me dirijo a ustedes para solicitar una revisión y posible ajuste de la propuesta comercial que he recibido.

Detalles del usuario:
- ID de usuario: ${userId}
- Fecha de solicitud: ${new Date().toLocaleDateString("es-ES")}

Me gustaría solicitar una apelación de mi propuesta actual debido a que considero que podría requerir algunos ajustes para adaptarse mejor a mis necesidades específicas de negocio.

Agradecería mucho si pudieran revisar mi caso y contactarme para discutir las posibles modificaciones o alternativas disponibles.

Quedo a la espera de su respuesta y agradezco de antemano su atención a esta solicitud.

Saludos cordiales,
${user?.name || "Usuario"} ${user?.lastname || ""}
${user?.email || ""}`,
          }
        : {
            subject: `Proposal Appeal Request ${userId}`,
            body: `Dear Bloom Team,

I hope this message finds you well. I am reaching out to request a review and possible adjustment of the commercial proposal I have received.

User Details:
- User ID: ${userId}
- Request Date: ${new Date().toLocaleDateString("en-US")}

I would like to request an appeal of my current proposal as I believe it may require some adjustments to better suit my specific business needs.

I would greatly appreciate if you could review my case and contact me to discuss possible modifications or available alternatives.

I look forward to your response and thank you in advance for your attention to this request.

Best regards,
${user?.name || "User"} ${user?.lastname || ""}
${user?.email || ""}`,
          };

    // Crear el enlace mailto
    const mailtoLink = `mailto:hgazz0@gmail.com?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.body)}`;

    // Abrir el cliente de email
    window.location.href = mailtoLink;
  };

  return (
    <div style={styles.sidebar}>
      {/* Actions */}
      <div style={styles.sidebarCard}>
        <h4 style={styles.sidebarTitle}>{dict("actions_title")}</h4>

        <div style={styles.checkboxContainer}>
          <input type='checkbox' style={styles.checkbox} onChange={() => setChecked(!checked)} id='terms-checkbox' />
          <label htmlFor='terms-checkbox'>{dict("terms_acceptance")}</label>
        </div>

        <button
          style={{
            ...styles.continueButton,
            backgroundColor: !checked ? "#cbd5e1" : "var(--color-primary)",
          }}
          disabled={!checked}
          onClick={handleClick}
        >
          <p style={{ color: !checked ? "#475569" : "#FFFFFF" }}>{dict("continue_proposal")}</p>
        </button>

        <button style={styles.secondaryButton} onClick={handleFeedbackClick}>
          <MessageCircle size={"1.7rem"} color='#FFFFFF' />
          <p style={{ color: "#FFFFFF" }}>{dict("give_feedback")}</p>
        </button>
      </div>

      {/* Help Section */}
      <div style={styles.helpSection}>
        <HelpCircle style={styles.helpIcon} />
        <h4 style={styles.helpTitle}>{dict("need_help")}</h4>
        <p style={styles.helpText}>{dict("help_description")}</p>
      </div>
    </div>
  );
}

export default ProposalActions;
