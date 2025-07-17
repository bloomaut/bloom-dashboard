"use client";
import { CatalogStoreProvider } from "@/context/CatalogStoreContext";
import CatalogPage from "@/routes/Catalog";

export default function Page() {
  return (
    <CatalogStoreProvider>
      <CatalogPage />
    </CatalogStoreProvider>
  );
}
