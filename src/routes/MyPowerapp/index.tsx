import { CatalogProvider } from "@/context/CatalogContext";
import MyPowerapp from "./MyPowerapp";

const CatalogPage = () => {
  return (
    <CatalogProvider>
      <MyPowerapp />
    </CatalogProvider>
  );
};

export default CatalogPage;
