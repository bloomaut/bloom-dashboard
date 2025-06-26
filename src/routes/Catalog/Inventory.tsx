"use client";

import { useState } from "react";
import { InventorySetup } from "@/components/v0Components/InventorySetup";
import { InventoryDashboard } from "@/components/v0Components/InventoryDashboard";
import { Sidebar } from "@/components/v0Components/Sidebar";

export default function InventoryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasProducts, setHasProducts] = useState(false);

  const handleFirstProductAdded = () => {
    setHasProducts(true);
  };

  return (
    <div className='flex h-screen w-full bg-gray-50'>
      {!hasProducts ? <InventorySetup onFirstProductAdded={handleFirstProductAdded} /> : <InventoryDashboard />}
    </div>
  );
}
