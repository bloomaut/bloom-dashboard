import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";

interface CatalogContextType {
  datasets: DatasetProps[];
  loading: boolean;
}

const CatalogContext = createContext<CatalogContextType>({
  datasets: [],
  loading: true,
});

export const CatalogProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [datasets, setDatasets] = useState<DatasetProps[]>([]);

  const fetchDatasets = async () => {
    const data = await get("datasets/small/list", ENV.BOX);
    if (data.statusCode === 200) {
      setDatasets(data.data.datasets);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <CatalogContext.Provider
      value={{
        datasets,
        loading,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => useContext(CatalogContext);
