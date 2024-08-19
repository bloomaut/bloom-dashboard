import { CatalogServicesProvider, useCatalogServiceContext } from "@/context/CatalogServicesContext";
import { ENV } from "@/typescript/types/api";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
// Components
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import LoadingSpinner from "@/components/Loading";
import TableHead from "../CatalogDetail/TableHead";
import TableRow from "../CatalogDetail/TableRow";
import Header from "./Header";
import PopupUpdatePrices from "../CatalogDetail/PopupUpdatePrices";
import { DataschemaField } from "@/typescript/interfaces/catalog.interface";
import { useMessageToast } from "@/hooks/useMessageToast";

const Service = () => {
  const { loading, setLoading, service, fetchDatasetById } = useCatalogServiceContext();
  const [updatePricePopup, setUpdatePricePopup] = useState<boolean>(false);
  const [dataItemsCount, setDataItemsCount] = useState<number>(0);
  const { notify, notifyError } = useMessageToast();
  const { id } = useParams();
  const dict = useTranslations("dict");

  return (
    <section className={styles.catalog_services_container}>
      <Header name={service?.dataSet.name} quantity={service?.dataSet.dataschema?.fields.length} id={id} />
    </section>
  );
};

export default Service;
