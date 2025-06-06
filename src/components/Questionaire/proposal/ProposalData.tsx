import React from "react";
import { Download } from "lucide-react";
import { styles } from "./styles";

function ProposalData() {
  return (
    <div style={styles.mainContent}>
      <div style={styles.pdfSection}>
        <div style={styles.pdfLeft}>
          <div style={styles.pdfIcon}>
            <span>📄</span>
          </div>
          <span style={styles.pdfText}>propuesta-small.pdf</span>
        </div>
        <button style={styles.downloadButton}>
          <Download size={16} />
          <span>Descargar</span>
        </button>
      </div>

      {/* Commercial Proposal Card */}
      <div style={styles.proposalCard}>
        <div style={styles.proposalHeader}>
          <h2 style={styles.proposalTitle}>PROPUESTA COMERCIAL</h2>
          <p style={styles.proposalSubtitle}>Solución personalizada para tu empresa</p>
        </div>

        {/* Resumen */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Resumen Ejecutivo</h3>
          <p style={styles.sectionText}>
            Basándonos en las respuestas proporcionadas durante el proceso de onboarding, hemos desarrollado una
            propuesta integral que aborda tus objetivos de captación digital y crecimiento de ventas del 30% para
            finales de año.
          </p>
        </div>

        {/* Los Objetivos */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Objetivos Identificados</h3>
          <ul style={styles.objectivesList}>
            <li style={styles.objectiveItem}>
              <span style={styles.bullet}>•</span>
              <span>Expandir presencia en línea</span>
            </li>
            <li style={styles.objectiveItem}>
              <span style={styles.bullet}>•</span>
              <span>Aumentar ventas en un 30%</span>
            </li>
            <li style={styles.objectiveItem}>
              <span style={styles.bullet}>•</span>
              <span>Mejorar captación de nuevos clientes</span>
            </li>
            <li style={styles.objectiveItem}>
              <span style={styles.bullet}>•</span>
              <span>Establecer catálogos ordenados a largo plazo</span>
            </li>
          </ul>
        </div>

        {/* Solucion */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Solución Propuesta</h3>
          <p style={styles.sectionText}>
            Implementación de una estrategia digital integral que incluye optimización de presencia online, campañas de
            marketing digital dirigidas y sistemas de conversión mejorados.
          </p>
        </div>

        {/* inversion */}
        <div style={styles.investmentSection}>
          <h3 style={styles.sectionTitle}>Inversión Total</h3>
          <div style={styles.investmentAmount}>$15,000 USD</div>
          <p style={styles.investmentDetails}>Implementación en 3 fases durante 6 meses</p>
        </div>
      </div>
    </div>
  );
}

export default ProposalData;
