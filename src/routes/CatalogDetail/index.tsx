"use client";
import Detail from "./Detail";
import { CatalogDetailProvider } from "@/context/CatalogDetailContext";

const CatalogDetail = () => {
  return (
    <CatalogDetailProvider>
      <Detail />
    </CatalogDetailProvider>
  );
};

export default CatalogDetail;
