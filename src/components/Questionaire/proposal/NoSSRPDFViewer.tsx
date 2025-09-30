"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

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
  const user = useAppSelector(state => state.userData);

  useEffect(() => {
    let mounted = true;

    // dynamic import of react-pdf and its css so the module is only evaluated on the client
    (async () => {
      try {
        const mod = await import("react-pdf");
        // import CSS after module loads (optional)
        // await import("react-pdf/dist/Page/AnnotationLayer.css");
        if (!mounted) return;

        const { Document, Page, pdfjs } = mod as any;
        // set worker src for client
        if (pdfjs && typeof pdfjs.GlobalWorkerOptions !== "undefined") {
          pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        }

        setLoaded({ Document, Page, pdfjs });
      } catch (err) {
        // keep silent here; render will just show fallback
        // console.error("Failed to load react-pdf:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    // Remove text layer and annotation layer produced by react-pdf
    const removeTextLayers = () => {
      const textLayers = Array.from(document.getElementsByClassName("react-pdf__Page__textContent"));
      textLayers.forEach(el => el.remove());

      const annotationLayers = Array.from(document.getElementsByClassName("react-pdf__Page__annotations"));
      annotationLayers.forEach(el => el.remove());
    };

    // Remove immediately and also with a slight delay to catch dynamically added elements
    removeTextLayers();
    const timeoutId = setTimeout(removeTextLayers, 100);

    return () => clearTimeout(timeoutId);
  }, [loaded, numPages]);

  if (!loaded) {
    return (
      <div style={{ width: "100%", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Cargando visor PDF...
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
    // keep previous behaviour (subtract 1 if needed) — set to payload.numPages by default
    setNumPages(payload.numPages ? payload.numPages - 1 : payload.numPages);
  };

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Document
        file={file}
        onLoadSuccess={onLoadSuccess}
        onLoadError={(e: any) => console.error("Error loading PDF:", e)}
        options={{
          // Disable text layer rendering
          disableTextLayer: true,
          // Disable annotation layer rendering
          disableAnnotationLayer: true,
        }}
      >
        <Page
          key={`page_${1}`}
          pageNumber={1}
          width={1200}
          height={3400}
          // Disable text and annotation layers at page level too
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}
