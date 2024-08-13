import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/Loading";
import { useState } from "react";
//Components
import CatalogCard from "./CatalogCard";
import { Fade } from "react-awesome-reveal";
import ProductsPopup from "./ProductsPopup";
import { useCatalogContext } from "@/context/CatalogContext";

interface Props {
  datasets: DatasetProps[];
  loading: boolean;
}

const Catalogs = ({ datasets, loading }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { datasetDetail } = useCatalogContext();
  const dict = useTranslations("dict.business.my-powerapp");

  console.log(datasetDetail);

  return (
    <div className={styles.container}>
      <div className={styles.inner_container}>
        <h2>{dict("uploaded_catalogs")}</h2>
        <Fade triggerOnce className={styles.catalogs}>
          {loading ? (
            <LoadingSpinner />
          ) : datasets.length ? (
            <>
              {datasets.map((dataset: DatasetProps) => (
                <CatalogCard
                  title={dataset.name}
                  products={dataset.totalDataItems}
                  setShowModal={setShowModal}
                  id={dataset._id}
                  key={dataset._id}
                />
              ))}
            </>
          ) : (
            <p>{dict("empty_dataset")}</p>
          )}
        </Fade>
      </div>
      {showModal && datasetDetail && (
        <ProductsPopup title={datasetDetail.dataSet.name} setShowConfirmation={setShowModal} products={datasetDetail} />
      )}
    </div>
  );
};

export default Catalogs;
