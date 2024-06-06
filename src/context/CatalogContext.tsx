import { createContext, useContext, useEffect, useState } from "react";
import { get, post, update } from "@/services/fetch";
import { DataschemaProps, DatasetProps } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useTranslations } from "next-intl";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDataschemaData } from "@/store/features/dataschemaSlice";

interface CatalogContextType {
  datasets: DatasetProps[];
  loading: boolean;
  updateDataset: (id: string, newName: string) => Promise<void>;
  postDataschema: (name: string, id: string) => Promise<void>;
  dataschemas: DataschemaProps[];
}

const CatalogContext = createContext<CatalogContextType>({
  datasets: [],
  loading: true,
  updateDataset: async () => {
    throw new Error("updateDataset function not implemented");
  },
  postDataschema: async () => {
    throw new Error("postDataschema function not implemented");
  },
  dataschemas: [],
});

export const CatalogProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [datasets, setDatasets] = useState<DatasetProps[]>([]);
  const { notify, notifyError } = useMessageToast();
  const dataschemas = useAppSelector(data => data.dataschema);
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict");

  const fetchDatasets = async () => {
    const data = await get("datasets/small/list", ENV.BOX);
    if (data.statusCode === 200) {
      setDatasets(data.data.datasets);
    }
    setLoading(false);
  };
  const fetchDataSchemas = async () => {
    const data = await get("dataschemas/dataprovider/small", ENV.BOX);
    if (data.statusCode === 200) {
      dispatch(setDataschemaData(data.data));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatasets();
    fetchDataSchemas();
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

  const postDataschema = async (name: string, id: string) => {
    const postDataschema = {
      name,
      dataschema: id,
      order: 0,
    };
    const response = await post("datasets", postDataschema, ENV.BOX);
    if (response.statusCode === 200) {
      notify(dict("toast.post_dataset"));
      fetchDataSchemas();
    } else {
      notifyError(dict("toast.error_dataset"));
    }
  };

  return (
    <CatalogContext.Provider
      value={{
        datasets,
        loading,
        updateDataset,
        postDataschema,
        dataschemas,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => useContext(CatalogContext);
