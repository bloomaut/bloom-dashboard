"use client";
import { CatalogServicesProvider } from "@/context/CatalogServicesContext";
import Service from "./Service";

const CatalogDetailServices = () => {
  return (
    <CatalogServicesProvider>
      <Service />
    </CatalogServicesProvider>
  );
};

export default CatalogDetailServices;
