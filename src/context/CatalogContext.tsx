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
  fetchDatasets: () => Promise<void>;
  handleRemoveDataset: (id: string) => void;
  handleAddDataset: (dataset: DatasetProps) => void;
  handleUpdateDataset: (updatedDataset: DatasetProps) => void;
}

const CatalogContext = createContext<CatalogContextType>({
  datasets: [],
  loading: true,
  fetchDatasets: async () => {
    throw new Error("fetchDatasets function not implemented");
  },
  handleRemoveDataset: () => {
    throw new Error("handleDeleteDataset function not implemented");
  },
  handleAddDataset: () => {
    throw new Error("handleAddDataset function not implemented");
  },
  handleUpdateDataset: () => {
    throw new Error("handleUpdateDataset function not implemented");
  },
});

export const CatalogProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [datasets, setDatasets] = useState<DatasetProps[]>([]);
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

  const handleRemoveDataset = (deletedId: string) => {
    setDatasets(datasets.filter(item => item._id !== deletedId));
  };

  const handleAddDataset = (newDataset: DatasetProps) => {
    const datasetWithTotalItems = {
      ...newDataset,
      totalDataItems: 0,
    };

    setDatasets(prevDatasets => [...prevDatasets, datasetWithTotalItems]);
  };

  const handleUpdateDataset = (updatedDataset: DatasetProps) => {
    setDatasets(prevDatasets =>
      prevDatasets.map(dataset => (dataset._id === updatedDataset._id ? updatedDataset : dataset)),
    );
  };

  useEffect(() => {
    fetchDatasets();
    fetchDataSchemas();
  }, []);

  return (
    <CatalogContext.Provider
      value={{
        datasets,
        handleRemoveDataset,
        handleAddDataset,
        handleUpdateDataset,
        loading,
        fetchDatasets,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => useContext(CatalogContext);
