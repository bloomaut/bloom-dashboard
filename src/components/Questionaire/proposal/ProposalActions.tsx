import { Download, HelpCircle, MessageCircle } from "lucide-react";
import React from "react";
import { styles } from "./styles";

function ProposalActions() {
  return (
    <div style={styles.sidebar}>
      {/* Actions */}
      <div style={styles.sidebarCard}>
        <h3 style={styles.sidebarTitle}>Acciones</h3>

        <button
          style={styles.primaryButton}
          onMouseOver={e => (e.target.style.backgroundColor = "#dc2626")}
          onMouseOut={e => (e.target.style.backgroundColor = "#ef4444")}
        >
          <Download size={16} />
          <span>Descargar Propuesta</span>
        </button>

        <div style={styles.checkboxContainer}>
          <input type='checkbox' style={styles.checkbox} />
          <span>He leído y acepto los términos de esta propuesta comercial</span>
        </div>

        <button
          style={styles.secondaryButton}
          onMouseOver={e => (e.target.style.backgroundColor = "#f9fafb")}
          onMouseOut={e => (e.target.style.backgroundColor = "white")}
        >
          <MessageCircle size={16} />
          <span>Dar Feedback / Ajustar</span>
        </button>
      </div>

      {/* Help Section */}
      <div style={styles.helpSection}>
        <HelpCircle style={styles.helpIcon} />
        <h4 style={styles.helpTitle}>¿Necesitas ayuda?</h4>
        <p style={styles.helpText}>Nuestro equipo está disponible para resolver cualquier duda sobre tu propuesta.</p>
        <button
          style={styles.helpButton}
          onMouseOver={e => (e.target.style.backgroundColor = "#2563eb")}
          onMouseOut={e => (e.target.style.backgroundColor = "#3b82f6")}
        >
          Contactar Soporte
        </button>
      </div>
    </div>
  );
}

export default ProposalActions;
