import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
/* import { Dataset } from "@/typescript/interfaces/catalog.interface"; */
import { ENV } from "@/typescript/types/api";
import { useParams } from "next/navigation";

interface CatalogDetailContextType {
  datasetDetail: any | null;
  fetchDatasetById: () => Promise<void>;
  setLoading: (value: boolean) => void;
  loading: boolean;
}

const CatalogDetailContext = createContext<CatalogDetailContextType>({
  datasetDetail: null,
  fetchDatasetById: async () => {
    throw new Error("updateDataset function not implemented");
  },
  setLoading: () => {
    throw new Error("setLoading function not implemented");
  },
  loading: true,
});

export const CatalogDetailProvider = ({ children }: { children: JSX.Element }) => {
  const [datasetDetail, setDatasetDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    if (id) fetchDatasetById();
  }, [id]);

  const fetchDatasetById = async () => {
    const data = await get(`datasets/${id}`, ENV.BOX);
    if (data.statusCode === 200) {
      setDatasetDetail(data.data);
    }
    setLoading(false);
  };

  return (
    <CatalogDetailContext.Provider
      value={{
        datasetDetail,
        fetchDatasetById,
        setLoading,
        loading,
      }}
    >
      {children}
    </CatalogDetailContext.Provider>
  );
};

export const useCatalogDetailContext = () => useContext(CatalogDetailContext);
