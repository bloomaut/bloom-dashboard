import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { DatasetProps, DatasetDetailType } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useAppDispatch } from "@/store/hooks";
import { setDataschemaData } from "@/store/features/dataschemaSlice";
import { setCatalogComplete } from "@/store/features/userSlice";

interface CatalogContextType {
  datasets: DatasetProps[];
  loading: boolean;
  datasetDetail: DatasetDetailType | null | undefined;
  fetchDatasets: () => Promise<void>;
  fetchDatasetById: (id: string) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType>({
  datasets: [],
  loading: true,
  datasetDetail: null,
  fetchDatasets: async () => {
    throw new Error("fetchDatasets function not implemented");
  },
  fetchDatasetById: async () => {
    throw new Error("fetchDatasetById function not implemented");
  },
});

export const CatalogProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [datasets, setDatasets] = useState<DatasetProps[]>([]);
  const [datasetDetail, setDatasetDetail] = useState<DatasetDetailType | null | undefined>(null);
  const dispatch = useAppDispatch();

  const fetchDatasets = async () => {
    const data = await get("datasets/small/list", ENV.BOX);
    if (data.statusCode === 200) {
      setDatasets(data.data.datasets);
      const isComplete = data.data.datasets.some((obj: DatasetProps) => obj.totalDataItems >= 1);
      dispatch(setCatalogComplete(isComplete));
    }
    setLoading(false);
  };

  const fetchDataSchemas = async () => {
    const data = await get("dataschemas/dataprovider/small", ENV.BOX);
    if (data.statusCode === 200) {
      dispatch(setDataschemaData(data.data));
    }
  };

  const fetchDatasetById = async (id: string) => {
    setDatasetDetail(null);
    const data = await get(`datasets/${id}`, ENV.BOX);
    if (data.statusCode === 200) {
      setDatasetDetail(data.data);
    }
  };

  useEffect(() => {
    fetchDatasets();
    fetchDataSchemas();
  }, []);

  return (
    <CatalogContext.Provider
      value={{
        datasets,
        loading,
        datasetDetail,
        fetchDatasets,
        fetchDatasetById,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => useContext(CatalogContext);
