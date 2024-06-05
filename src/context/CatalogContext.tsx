import { createContext, useContext, useEffect, useState } from "react";
import { get, update } from "@/services/fetch";
import { DatasetProps, DataItems } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useTranslations } from "next-intl";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useParams } from "next/navigation";

interface CatalogContextType {
  datasets: DatasetProps[];
  datasetDetail: DataItems[];
  loading: boolean;
  updateDataset: (id: string, newName: string) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType>({
  datasets: [],
  datasetDetail: [],
  loading: true,
  updateDataset: async () => {
    throw new Error("updateDataset function not implemented");
  },
});

export const CatalogProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [datasets, setDatasets] = useState<DatasetProps[]>([]);
  const [datasetDetail, setDatasetDetail] = useState<DataItems[]>([]);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");
  const { id } = useParams();

  const fetchDatasets = async () => {
    const data = await get("datasets/small/list", ENV.BOX);
    if (data.statusCode === 200) {
      setDatasets(data.data.datasets);
    }
    setLoading(false);
  };

  const fetchDatasetById = async () => {
    const data = await get(`datasets/${id}`, ENV.BOX);
    if (data.statusCode === 200) {
      setDatasetDetail(data.data.dataItems);
    }
    setLoading(false);
  };

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

  useEffect(() => {
    fetchDatasets();
  }, []);

  useEffect(() => {
    if (id) fetchDatasetById();
  }, [id]);

  return (
    <CatalogContext.Provider
      value={{
        datasets,
        datasetDetail,
        loading,
        updateDataset,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => useContext(CatalogContext);
