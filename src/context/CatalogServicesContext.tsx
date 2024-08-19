import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useParams } from "next/navigation";
import { DatasetDetailType, DataItemsType } from "@/typescript/interfaces/catalog.interface";

interface CatalogServiceContextType {
  service: DatasetDetailType | null | undefined;
  fetchDatasetById: () => Promise<void>;
  setLoading: (value: boolean) => void;
  loading: boolean;
  handleRemoveService: (deletedId: string) => void;
  handleAddService: (dataset: DataItemsType) => void;
  handleUpdateService: (updatedDataset: DataItemsType) => void;
}

const CatalogServiceContext = createContext<CatalogServiceContextType>({
  service: null,
  fetchDatasetById: async () => {
    throw new Error("fetchDatasetById function not implemented");
  },
  setLoading: () => {
    throw new Error("setLoading function not implemented");
  },
  loading: true,
  handleRemoveService: () => {
    throw new Error("handleRemoveService function not implemented");
  },
  handleAddService: () => {
    throw new Error("handleAddService function not implemented");
  },
  handleUpdateService: () => {
    throw new Error("handleUpdateService function not implemented");
  },
});

export const CatalogServicesProvider = ({ children }: { children: JSX.Element }) => {
  const [service, setService] = useState<DatasetDetailType | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    if (id) fetchDatasetById();
  }, [id]);

  const fetchDatasetById = async () => {
    const data = await get(`datasets/${id}`, ENV.BOX);
    if (data.statusCode === 200) {
      setService(data.data);
    }
    setLoading(false);
  };

  const handleRemoveService = (deletedId: string) => {
    if (service) {
      const filteredDataItems = service.dataItems.filter(item => item._id !== deletedId);
      setService({ ...service, dataItems: filteredDataItems });
    }
  };

  const handleAddService = (dataset: DataItemsType) => {
    if (service) {
      setService({ ...service, dataItems: [...service.dataItems, dataset] });
    }
  };

  const handleUpdateService = (updatedDataset: DataItemsType) => {
    if (service) {
      const updatedDataItems = service.dataItems.map(item =>
        item._id === updatedDataset._id ? { ...item, ...updatedDataset } : item,
      );
      setService({ ...service, dataItems: updatedDataItems });
    }
  };

  return (
    <CatalogServiceContext.Provider
      value={{
        service,
        fetchDatasetById,
        handleRemoveService,
        handleAddService,
        handleUpdateService,
        setLoading,
        loading,
      }}
    >
      {children}
    </CatalogServiceContext.Provider>
  );
};

export const useCatalogServiceContext = () => useContext(CatalogServiceContext);
