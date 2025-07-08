"use client";

import { useEffect, useState } from "react";
import { InventorySetup } from "@/components/v0Components/InventorySetup";
import { InventoryDashboard } from "@/components/v0Components/InventoryDashboard";
import { useCatalogContext } from "@/context/CatalogContext";

export default function InventoryPage() {
  const { datasets, loading } = useCatalogContext();
  const [hasProductsOrServices, setHasProductsOrServices] = useState(false);

  useEffect(() => {
    // Check if any dataset has at least one product or service
    const found = datasets.some(ds => typeof ds.totalDataItems === "number" && ds.totalDataItems > 0);
    setHasProductsOrServices(found);
  }, [datasets]);

  return (
    <div className='flex h-screen w-full bg-gray-50'>
      {hasProductsOrServices ? (
        <InventoryDashboard />
      ) : (
        <InventorySetup onFirstProductAdded={() => setHasProductsOrServices(true)} />
      )}
    </div>
  );
}
