import { createContext, useContext, useEffect, useState } from "react";
import { get, post, update } from "@/services/fetch";
import { DataschemaProps, DatasetProps, Dataset } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useTranslations } from "next-intl";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDataschemaData } from "@/store/features/dataschemaSlice";

interface CatalogContextType {
  datasets: DatasetProps[];
  datasetDetail: Dataset | null;
  loading: boolean;
  dataschemas: DataschemaProps[];
  fetchDatasets: () => Promise<void>;
  postDataschema: (name: string, id: string) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType>({
  datasets: [],
  datasetDetail: null,
  loading: true,
  dataschemas: [],
  fetchDatasets: async () => {
    throw new Error("fetchDatasets function not implemented");
  },
  postDataschema: async () => {
    throw new Error("postDataschema function not implemented");
  },
});

export const CatalogProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [datasets, setDatasets] = useState<DatasetProps[]>([]);
  const [datasetDetail, setDatasetDetail] = useState<Dataset | null>(null);
  const { notify, notifyError } = useMessageToast();
  const { id } = useParams();
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

  const fetchDatasetById = async () => {
    const data = await get(`datasets/${id}`, ENV.BOX);
    if (data.statusCode === 200) {
      setDatasetDetail(data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatasets();
    fetchDataSchemas();
  }, []);

  useEffect(() => {
    if (id) fetchDatasetById();
  }, [id]);

  const postDataschema = async (name: string, id: string) => {
    const postDataschema = {
      name,
      dataschema: id,
      order: 0,
    };
    const response = await post("datasets", postDataschema, ENV.BOX);
    if (response.data.statusCode === 201) {
      notify(dict("toast.post_dataset"));
    } else {
      notifyError(dict("toast.error_dataset"));
    }
  };

  return (
    <CatalogContext.Provider
      value={{
        datasets,
        datasetDetail,
        loading,
        fetchDatasets,
        postDataschema,
        dataschemas,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => useContext(CatalogContext);
