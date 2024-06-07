"use client";
import { CatalogProvider } from "@/context/CatalogContext";
import Detail from "./CatalogDetail";

const CatalogDetail = () => {
  return (
    <CatalogProvider>
      <Detail />
    </CatalogProvider>
  );
};

export default CatalogDetail;
