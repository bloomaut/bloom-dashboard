"use client";
import Detail from "./Detail";
import { CatalogProductsProvider } from "@/context/CatalogProductsContext";

const CatalogDetailProducts = () => {
  return (
    <CatalogProductsProvider>
      <Detail />
    </CatalogProductsProvider>
  );
};

export default CatalogDetailProducts;
