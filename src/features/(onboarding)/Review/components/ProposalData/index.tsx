"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Download, FileText } from "lucide-react";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

// client-only dynamic import to ensure react-pdf bundle isn't required during SSR
const PDFViewer = dynamic(() => import("../NoSSRPDFViewer"), { ssr: false });

interface ProposalDataProps {
  pdfFile?: string | null;
}

function ProposalData({ pdfFile }: ProposalDataProps) {
  const dict = useTranslations("dict.proposal");

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!pdfFile) {
      console.error("No PDF file URL available");
      return;
    }

    try {
      // Use the proxy for external URLs to avoid CORS issues
      const isExternalUrl = pdfFile.startsWith("http") && !pdfFile.includes(window.location.hostname);
      const fetchUrl = isExternalUrl ? `/api/pdf-proxy?url=${encodeURIComponent(pdfFile)}` : pdfFile;

      // Fetch the PDF file through proxy
      const response = await fetch(fetchUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status}`);
      }

      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "bloom_proposal.pdf";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      // Cleanup after a short delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Fallback: abrir en nueva pestaña para no bloquear al usuario
      const fallbackUrl =
        pdfFile.startsWith("http") && !pdfFile.includes(window.location.hostname)
          ? `/api/pdf-proxy?url=${encodeURIComponent(pdfFile)}`
          : pdfFile;
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.pdfSection}>
        <div className={styles.pdfLeft}>
          <FileText size={"2.5rem"} color='#FFFFFF' />
          <span className={styles.pdfText}>{dict("pdf_title")}</span>
        </div>
        <button type='button' className={styles.downloadButton} onClick={handleDownload}>
          <Download size={"1.3rem"} />
          <p>{dict("download")}</p>
        </button>
      </div>
      <div className={styles.pdfContainer}>
        <PDFViewer pdfUrl={pdfFile} />
      </div>
    </div>
  );
}

export default ProposalData;
