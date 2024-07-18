import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { useCatalogContext } from "@/context/CatalogContext";
import Title from "@/components/Title";
//Components
import Catalogs from "./Catalogs";
import Phone from "./Phone";

const MyPowerapp = () => {
  const dict = useTranslations("dict.business.my-powerapp");
  const { datasets, loading } = useCatalogContext();

  return (
    <div className={styles.container}>
      <div>
        <Title text={dict("title")} />
        <p className={styles.subtitle}>{dict("subtitle")}</p>
      </div>
      <div className={styles.inner_container}>
        <div></div> {/* Aca va Businesss information  */}
        <Catalogs datasets={datasets} loading={loading} />
        <Phone />
      </div>
      <div className={styles.button}>
        <Button title={dict("button_generate")} />
      </div>
    </div>
  );
};

export default MyPowerapp;
