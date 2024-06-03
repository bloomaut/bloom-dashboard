import { CatalogProvider } from "@/context/CatalogContext";
import Catalog from "./Catalog";

const CatalogPage = () => {
  return (
    <CatalogProvider>
      <Catalog />
    </CatalogProvider>
  );
};

export default CatalogPage;
