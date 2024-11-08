import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { DatasetProps, DatasetDetailType } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDataschemaData } from "@/store/features/dataschemaSlice";
import { setCatalogComplete } from "@/store/features/userSlice";

interface CatalogContextType {
  datasets: DatasetProps[];
  datasetDetail: DatasetDetailType | null | undefined;
  loading: boolean;
  fetchDatasets: () => Promise<void>;
  fetchDatasetById: (id: string) => Promise<void>;
  handleRemoveDataset: (id: string) => void;
  handleAddDataset: (dataset: DatasetProps) => void;
  handleUpdateDataset: (updatedDataset: DatasetProps) => void;
}

const CatalogContext = createContext<CatalogContextType>({
  datasets: [],
  datasetDetail: null,
  loading: true,
  fetchDatasets: async () => {
    throw new Error("fetchDatasets function not implemented");
  },
  fetchDatasetById: async () => {
    throw new Error("fetchDatasetById function not implemented");
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
  const [datasetDetail, setDatasetDetail] = useState<DatasetDetailType | null | undefined>(null);
  const { clientId } = useAppSelector(state => state.ricardosData);
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
    setDatasets(prevDatasets => {
      return prevDatasets.map(dataset => {
        if (dataset._id === updatedDataset._id) {
          return {
            ...dataset,
            ...updatedDataset,
            totalDataItems: dataset.totalDataItems,
          };
        }
        return dataset;
      });
    });
  };

  useEffect(() => {
    fetchDatasets();
    fetchDataSchemas();
  }, [clientId]);

  return (
    <CatalogContext.Provider
      value={{
        datasets,
        fetchDatasetById,
        datasetDetail,
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
