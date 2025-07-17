"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

const PDFViewer = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const user = useAppSelector(state => state.userData);
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages - 1);
  };

  useEffect(() => {
    const docs = document.getElementsByClassName("react-pdf__Page__textContent textLayer");
    const elements = Array.from(docs);
    elements.forEach(el => el.remove());
  }, [numPages]);

  return (
    <div>
      <Document
        file={user.client.proposal_url || "/pdf/ejemplo-doc-propuesta-comercial.pdf"}
        onLoadSuccess={onLoadSuccess}
        onLoadError={error => console.error("Error loading PDF:", error)}
      >
        <Page key={`page_${1}`} pageNumber={1} width={1200} height={3400} />
      </Document>
    </div>
  );
};

export default PDFViewer;
