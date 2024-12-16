"use client";
import Detail from "./Detail";
import { CatalogStoreProvider } from "@/context/CatalogStoreContext";

const CatalogDetailStore = () => {
  return (
    <CatalogStoreProvider>
      <Detail />
    </CatalogStoreProvider>
  );
};

export default CatalogDetailStore;
