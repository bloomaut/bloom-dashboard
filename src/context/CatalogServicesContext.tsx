import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useParams } from "next/navigation";
import { DatasetDetailServices, DataItemsServiceType } from "@/typescript/interfaces/catalog.interface";
import { useAppSelector } from "@/store/hooks";

interface CatalogServiceContextType {
  services: DatasetDetailServices | null | undefined;
  fetchDatasetById: () => Promise<void>;
  setLoading: (value: boolean) => void;
  loading: boolean;
  handleRemoveService: (deletedId: string) => void;
  handleAddService: (dataset: DataItemsServiceType) => void;
  handleUpdateService: (updatedDataset: DataItemsServiceType) => void;
}

const CatalogServiceContext = createContext<CatalogServiceContextType>({
  services: null,
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
  const [services, setServices] = useState<DatasetDetailServices | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const { clientId } = useAppSelector(state => state.ricardosData);

  useEffect(() => {
    if (id) fetchDatasetById();
  }, [id, clientId]);

  const fetchDatasetById = async () => {
    const data = await get(`datasets/${id}`, ENV.BOX);
    if (data.statusCode === 200) {
      setServices(data.data);
    }
    setLoading(false);
  };

  const handleRemoveService = (deletedId: string) => {
    if (services) {
      const filteredDataItems = services.dataItems.filter(item => item._id !== deletedId);
      setServices({ ...services, dataItems: filteredDataItems });
    }
  };

  const handleAddService = (dataset: DataItemsServiceType) => {
    if (services) {
      setServices({ ...services, dataItems: [...services.dataItems, dataset] });
    }
  };

  const handleUpdateService = (updatedDataset: DataItemsServiceType) => {
    if (services) {
      const updatedDataItems = services.dataItems.map(item =>
        item._id === updatedDataset._id ? { ...item, ...updatedDataset } : item,
      );
      setServices({ ...services, dataItems: updatedDataItems });
    }
  };

  return (
    <CatalogServiceContext.Provider
      value={{
        services,
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
