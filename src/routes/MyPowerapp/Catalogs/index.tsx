import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/Loading";

//Components
import CatalogCard from "./CatalogCard";
import { Fade } from "react-awesome-reveal";

interface Props {
  datasets: DatasetProps[];
  loading: boolean;
}

const Catalogs = ({ datasets, loading }: Props) => {
  const dict = useTranslations("dict.business.my-powerapp");
  return (
    <div className={styles.container}>
      <div className={styles.inner_container}>
        <h2>{dict("uploaded_catalogs")}</h2>
        <Fade triggerOnce className={styles.catalogs}>
          {loading ? (
            <LoadingSpinner />
          ) : datasets.length ? (
            <>
              {datasets.map(dataset => (
                <CatalogCard key={dataset._id} title={dataset.name} products={dataset.totalDataItems} />
              ))}
            </>
          ) : (
            <p>{dict("empty_dataset")}</p>
          )}
        </Fade>
      </div>
    </div>
  );
};

export default Catalogs;
