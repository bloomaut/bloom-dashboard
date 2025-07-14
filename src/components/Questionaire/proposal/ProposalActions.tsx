"use client";
import { Download, HelpCircle, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { styles } from "./styles";
import { approveProposal } from "@/services/fetch";
import { useRouter } from "next/navigation";

function ProposalActions() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const hadleClick = () => {
    approveProposal();
    router.push("/");
  };
  return (
    <div style={styles.sidebar}>
      {/* Actions */}
      <div style={styles.sidebarCard}>
        <h3 style={styles.sidebarTitle}>Acciones</h3>

        <button style={styles.primaryButton}>
          <Download size={16} />
          <span>Descargar Propuesta</span>
        </button>

        <div style={styles.checkboxContainer}>
          <input type='checkbox' style={styles.checkbox} onChange={() => setChecked(!checked)} />
          <span>He leído y acepto los términos de esta propuesta comercial</span>
        </div>
        <button
          className='my-2'
          style={{ ...styles.secondaryButton, backgroundColor: !checked ? "#bebebe" : "#ff5722", color: "white" }}
          disabled={!checked}
          onClick={hadleClick}
        >
          <span className='whitespace-nowrap'>Continuar con la propuesta</span>
        </button>
        <button style={styles.secondaryButton}>
          <MessageCircle size={16} />
          <span>Dar Feedback / Ajustar</span>
        </button>
      </div>

      {/* Help Section */}
      <div style={styles.helpSection}>
        <HelpCircle style={styles.helpIcon} />
        <h4 style={styles.helpTitle}>¿Necesitas ayuda?</h4>
        <p style={styles.helpText}>Nuestro equipo está disponible para resolver cualquier duda sobre tu propuesta.</p>
        <button style={styles.helpButton}>Contactar Soporte</button>
      </div>
    </div>
  );
}

export default ProposalActions;
