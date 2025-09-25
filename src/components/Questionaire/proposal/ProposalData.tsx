"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { styles } from "./styles";

const PDFViewer = dynamic(() => import("./NoSSRPDFViewer"), { ssr: false });

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
      <PDFViewer />
    </div>
  );
}

export default ProposalData;
