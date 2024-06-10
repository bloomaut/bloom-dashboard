"use client";
import { CatalogDetailProvider } from "@/context/CatalogDetailContext";
import Detail from "./Detail";

const CatalogDetail = () => {
  return (
    <CatalogDetailProvider>
      <Detail />
    </CatalogDetailProvider>
  );
};

export default CatalogDetail;
