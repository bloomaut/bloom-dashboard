import { useCatalogContext } from "@/context/CatalogContext";
import Header from "./Header";
import styles from "./styles.module.scss";
import Card from "./Card";
import LoadingSpinner from "@/components/Loading";
import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import { ChangeEvent, useState } from "react";
import { post } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppSelector } from "@/store/hooks";
import { ENV } from "@/typescript/types/api";
import PopupChildren from "@/components/PopupChildren";
import Input from "@/components/Input";
import PopupCreate from "./PopupCreate";

const Catalog = () => {
  const { datasets, fetchDatasets, loading } = useCatalogContext();
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const dict = useTranslations("dict");

  return (
    <div className={styles.catalog_container}>
      <Header />
      <div className={styles.cards_container}>
        {loading ? (
          <LoadingSpinner />
        ) : datasets.length ? (
          <>
            {datasets.map(dataset => (
              <Card key={dataset._id} {...dataset} />
            ))}
            <div className={styles.add} onClick={() => setShowPopupCreate(true)}>
              <Icon name='add' viewBox='0 0 20 22' width={50} height={50} strokeWidth={1.5} strokeColor='#282E7E' />
            </div>
          </>
        ) : (
          <p>{dict("catalog.empty_datasets")}</p>
        )}
        {showPopupCreate && (
          <PopupCreate
            title="Catalog's Information"
            setShowConfirmation={setShowPopupCreate}
            fetchDatasets={fetchDatasets}
          />
        )}
      </div>
    </div>
  );
};

export default Catalog;
