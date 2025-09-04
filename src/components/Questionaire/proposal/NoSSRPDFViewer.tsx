"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

type LoadedPdf = {
  Document: any;
  Page: any;
  pdfjs: any;
};

export default function NoSSRPDFViewer() {
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
    // remove text layer produced by react-pdf if present (keep client-only DOM ops in effect)
    const docs = Array.from(document.getElementsByClassName("react-pdf__Page__textContent"));
    docs.forEach(el => el.remove());
  }, [loaded, numPages]);

  if (!loaded) {
    return (
      <div style={{ width: "100%", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Cargando visor PDF...
      </div>
    );
  }

  const file = user?.client?.proposal_url || "/pdf/ejemplo-doc-propuesta-comercial.pdf";
  const { Document, Page } = loaded;

  const onLoadSuccess = (payload: { numPages: number }) => {
    // keep previous behaviour (subtract 1 if needed) — set to payload.numPages by default
    setNumPages(payload.numPages ? payload.numPages - 1 : payload.numPages);
  };

  return (
    <div>
      <Document
        file={file}
        onLoadSuccess={onLoadSuccess}
        onLoadError={(e: any) => console.error("Error loading PDF:", e)}
      >
        <Page key={`page_${1}`} pageNumber={1} width={1200} height={3400} />
      </Document>
    </div>
  );
}
