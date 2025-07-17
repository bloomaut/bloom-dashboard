import { CatalogProvider } from "@/context/CatalogContext";
import Catalog from "./Catalog";
import InventoryPage from "./Inventory";

const CatalogPage = () => {
  return (
    <CatalogProvider>
      <InventoryPage />
    </CatalogProvider>
  );
};

export default CatalogPage;
