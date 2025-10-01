"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { styles } from "./styles";

type LoadedPdf = {
  Document: any;
  Page: any;
  pdfjs: any;
};

interface NoSSRPDFViewerProps {
  pdfUrl?: string | null;
}

export default function NoSSRPDFViewer({ pdfUrl }: NoSSRPDFViewerProps) {
  const [loaded, setLoaded] = useState<LoadedPdf | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageWidth, setPageWidth] = useState<number>(800);
  const [documentLoaded, setDocumentLoaded] = useState<boolean>(false);
  const user = useAppSelector(state => state.userData);
  const dict = useTranslations("dict.proposal");

  // Calcular el ancho de la página basado en el contenedor
  useEffect(() => {
    const updatePageWidth = () => {
      const containerWidth = window.innerWidth;
      if (containerWidth < 768) {
        setPageWidth(containerWidth - 80); // Mobile
      } else if (containerWidth < 1024) {
        setPageWidth(600); // Tablet
      } else {
        setPageWidth(800); // Desktop
      }
    };

    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);
    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  useEffect(() => {
    let mounted = true;

    // dynamic import of react-pdf and its css so the module is only evaluated on the client
    (async () => {
      try {
        const mod = await import("react-pdf");
        if (!mounted) return;

        const { Document, Page, pdfjs } = mod as any;
        // set worker src for client
        if (pdfjs && typeof pdfjs.GlobalWorkerOptions !== "undefined") {
          pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        }

        setLoaded({ Document, Page, pdfjs });
      } catch (err) {
        console.error("Failed to load react-pdf:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Remover capas de texto solo cuando el documento se carga por primera vez
  useEffect(() => {
    if (!loaded || !documentLoaded) return;

    // Remove text layer and annotation layer produced by react-pdf
    const removeTextLayers = () => {
      const textLayers = Array.from(document.getElementsByClassName("react-pdf__Page__textContent"));
      textLayers.forEach(el => el.remove());

      const annotationLayers = Array.from(document.getElementsByClassName("react-pdf__Page__annotations"));
      annotationLayers.forEach(el => el.remove());
    };

    // Remove with a slight delay to catch dynamically added elements
    const timeoutId = setTimeout(removeTextLayers, 100);

    return () => clearTimeout(timeoutId);
  }, [loaded, documentLoaded]); // Removido currentPage de las dependencias

  if (!loaded) {
    return (
      <div
        style={{ 
          width: "100%", 
          height: "70vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          fontSize: "16px",
          color: "#6b7280"
        }}
      >
        {dict("loading")}...
      </div>
    );
  }

  // Determine the PDF file URL and proxy if needed
  const originalFile = pdfUrl || user?.client?.proposal_url || "/pdf/ejemplo-doc-propuesta-comercial.pdf";

  // Check if the URL is external and needs proxying
  const isExternalUrl = originalFile.startsWith("http") && !originalFile.includes(window.location.hostname);
  const file = isExternalUrl ? `/api/pdf-proxy?url=${encodeURIComponent(originalFile)}` : originalFile;

  const { Document, Page } = loaded;

  const onLoadSuccess = (payload: { numPages: number }) => {
    setNumPages(payload.numPages);
    setDocumentLoaded(true);
    // Solo resetear a página 1 si es un documento completamente nuevo
    if (!documentLoaded) {
      setCurrentPage(1);
    }
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages || 1));
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= (numPages || 1)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div style={styles.pdfContainer}>
      {/* PDF Viewer */}
      <div style={styles.pdfViewer}>
        <Document
          file={file}
          onLoadSuccess={onLoadSuccess}
          onLoadError={(e: any) => console.error("Error loading PDF:", e)}
          options={{
            disableTextLayer: true,
            disableAnnotationLayer: true,
          }}
        >
          <Page
            key={`page_${currentPage}`}
            pageNumber={currentPage}
            width={pageWidth}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {/* Navigation Controls */}
      {numPages && numPages > 1 && (
        <div style={styles.pdfNavigation}>
          <button
            style={{
              ...styles.navButton,
              backgroundColor: currentPage === 1 ? "#cbd5e1" : "var(--color-primary)",
            }}
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          <div style={styles.pageInfo}>
            Página {currentPage} de {numPages}
          </div>

          <button
            style={{
              ...styles.navButton,
              backgroundColor: currentPage === numPages ? "#cbd5e1" : "var(--color-primary)",
            }}
            onClick={goToNextPage}
            disabled={currentPage === numPages}
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Page Number Input for Quick Navigation */}
      {numPages && numPages > 3 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0.5rem",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderTop: "1px solid #e2e8f0",
          fontSize: "14px",
        }}>
          <span>Ir a página:</span>
          <input
            type="number"
            min={1}
            max={numPages}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
            style={{
              width: "60px",
              padding: "0.25rem 0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "14px",
            }}
          />
        </div>
      )}
    </div>
  );
}
