import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useParams } from "next/navigation";
import { DatasetDetailType, DataItemsType } from "@/typescript/interfaces/catalog.interface";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCatalogComplete } from "@/store/features/userSlice";

interface CatalogStoreContextType {
  datasetDetail: DatasetDetailType | null | undefined;
  fetchDatasetById: () => Promise<void>;
  setLoading: (value: boolean) => void;
  loading: boolean;
  handleRemoveDataset: (deletedId: string) => void;
  handleAddDataset: (dataset: DataItemsType) => void;
  handleUpdateDataset: (updatedDataset: DataItemsType) => void;
}

const CatalogStoreContext = createContext<CatalogStoreContextType>({
  datasetDetail: null,
  fetchDatasetById: async () => {
    throw new Error("fetchDatasetById function not implemented");
  },
  setLoading: () => {
    throw new Error("setLoading function not implemented");
  },
  loading: true,
  handleRemoveDataset: () => {
    throw new Error("handleRemoveDataset function not implemented");
  },
  handleAddDataset: () => {
    throw new Error("handleAddDataset function not implemented");
  },
  handleUpdateDataset: () => {
    throw new Error("handleUpdateDataset function not implemented");
  },
});

export const CatalogStoreProvider = ({ children }: { children: JSX.Element }) => {
  const [datasetDetail, setDatasetDetail] = useState<DatasetDetailType | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { clientId } = useAppSelector(state => state.ricardosData);
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) fetchDatasetById();
  }, [id, clientId]);

  const fetchDatasetById = async () => {
    const data = await get(`datasets/${id}`, ENV.BOX);
    if (data.statusCode === 200) {
      setDatasetDetail(data.data);
    }
    setLoading(false);
  };

  const handleRemoveDataset = (deletedId: string) => {
    if (datasetDetail) {
      const filteredDataItems = datasetDetail.dataItems.filter(item => item._id !== deletedId);
      setDatasetDetail({ ...datasetDetail, dataItems: filteredDataItems });
    }
  };

  const handleAddDataset = (dataset: DataItemsType) => {
    if (datasetDetail) {
      setDatasetDetail({ ...datasetDetail, dataItems: [...datasetDetail.dataItems, dataset] });
    }
    if (datasetDetail?.dataItems.length === 0) {
      dispatch(setCatalogComplete(true));
    }
  };

  const handleUpdateDataset = (updatedDataset: DataItemsType) => {
    if (datasetDetail) {
      const updatedDataItems = datasetDetail.dataItems.map(item =>
        item._id === updatedDataset._id ? { ...item, ...updatedDataset } : item,
      );
      setDatasetDetail({ ...datasetDetail, dataItems: updatedDataItems });
    }
  };

  return (
    <CatalogStoreContext.Provider
      value={{
        datasetDetail,
        fetchDatasetById,
        handleRemoveDataset,
        handleAddDataset,
        handleUpdateDataset,
        setLoading,
        loading,
      }}
    >
      {children}
    </CatalogStoreContext.Provider>
  );
};

export const useCatalogStoreContext = () => useContext(CatalogStoreContext);
