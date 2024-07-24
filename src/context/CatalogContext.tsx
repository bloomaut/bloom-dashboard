import { createContext, useContext, useEffect, useState } from "react";
import { get, post, update } from "@/services/fetch";
import { DataItems, DatasetProps, Onboarding } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useTranslations } from "next-intl";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppDispatch } from "@/store/hooks";
import { setDataschemaData } from "@/store/features/dataschemaSlice";
import { setCatalogComplete } from "@/store/features/userSlice";

interface CatalogContextType {
  datasets: DatasetProps[];
  loading: boolean;
  datasetDetail: any;
  updateDataset: (id: string, newName: string) => Promise<void>;
  fetchDatasets: () => Promise<void>;
  fetchDatasetById: (id: string) => Promise<void>;
  postOnboarding: (template_id: string, onboarding_id: string) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType>({
  datasets: [],
  loading: true,
  datasetDetail: false,
  updateDataset: async () => {
    throw new Error("updateDataset function not implemented");
  },
  fetchDatasets: async () => {
    throw new Error("updateDataset function not implemented");
  },
  fetchDatasetById: async () => {
    throw new Error("updateDataset function not implemented");
  },
  postOnboarding: async () => {
    throw new Error("postOnboarding function not implemented");
  },
});

export const CatalogProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [datasets, setDatasets] = useState<DatasetProps[]>([]);
  const [datasetDetail, setDatasetDetail] = useState(false);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");
  const dispatch = useAppDispatch();

  const fetchDatasets = async () => {
    const data = await get("datasets/small/list", ENV.BOX);
    if (data.statusCode === 200) {
      setDatasets(data.data.datasets);
      const isComplete = data.data.datasets.some((obj: DataItems) => obj.totalDataItems >= 1);
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
  const fetchDatasetById = async (id: string) => {
    setDatasetDetail(false);
    const data = await get(`datasets/${id}`, ENV.BOX);
    if (data.statusCode === 200) {
      setDatasetDetail(data.data);
    }
  };
  const postOnboarding = async (template_id: string, onboarding_id: string) => {
    setLoading(true);
    const postedOnboarding = {
      template_id,
      onboarding_id,
    };

    const response = await post("skinx-generator", postedOnboarding, ENV.TOOL);
    if (response.data.statusCode !== 201) {
      notifyError(dict("toast.bot_error"));
    }
    setLoading(false);
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
        updateDataset,
        fetchDatasets,
        fetchDatasetById,
        postOnboarding,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => useContext(CatalogContext);
