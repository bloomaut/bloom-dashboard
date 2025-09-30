"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Download, FileText } from "lucide-react";
import { styles } from "./styles";
import { useTranslations } from "next-intl";

// client-only dynamic import to ensure react-pdf bundle isn't required during SSR
const PDFViewer = dynamic(() => import("./NoSSRPDFViewer"), { ssr: false });

interface ProposalDataProps {
  pdfFile?: string | null;
}

function ProposalData({ pdfFile }: ProposalDataProps) {
  const dict = useTranslations("dict.proposal");
  return (
    <div style={styles.mainContent}>
      <div style={styles.pdfSection}>
        <div style={styles.pdfLeft}>
          <FileText size={"2.5rem"} color='#FFFFFF' />
          <span style={styles.pdfText}>{dict("pdf_title")}</span>
        </div>
        <button style={styles.downloadButton}>
          <Download size={"1.3rem"} />
          <p>{dict("download")}</p>
        </button>
      </div>
      <div style={styles.pdfContainer}>
        <PDFViewer pdfUrl={pdfFile}/>
      </div>
    </div>
  );
}

export default ProposalData;