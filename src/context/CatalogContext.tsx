import { createContext, useContext, useEffect, useState } from "react";
import { get, update } from "@/services/fetch";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useTranslations } from "next-intl";
import { useMessageToast } from "@/hooks/useMessageToast";

interface CatalogContextType {
  datasets: DatasetProps[];
  loading: boolean;
  updateDataset: (id: string, newName: string) => Promise<void>;
  fetchDatasets: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType>({
  datasets: [],
  loading: true,
  updateDataset: async () => {
    throw new Error("updateDataset function not implemented");
  },
  fetchDatasets: async () => {
    throw new Error("fetchDatasets function not implemented");
  },
});

export const CatalogProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [datasets, setDatasets] = useState<DatasetProps[]>([]);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

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

  const updateDataset = async (id: string, newName: string) => {
    const updatedDataset = {
      name: newName,
    };
    const response = await update("datasets", updatedDataset, id, ENV.BOX);
    if (response.statusCode === 200) {
      notify(dict("toast.success_edit"));
      fetchDatasets();
    } else {
      notifyError(dict("toast.error_edit"));
    }
  };

  return (
    <CatalogContext.Provider
      value={{
        datasets,
        loading,
        updateDataset,
        fetchDatasets,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => useContext(CatalogContext);
