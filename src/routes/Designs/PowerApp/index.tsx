import styles from "./styles.module.scss";
import HogCard from "../HogCard";
import LoadingSpinner from "@/components/Loading";
import { useDesignContext } from "@/context/DesignContext";
import { useTranslations } from "next-intl";

const PowerApp = () => {
  const { powerapps, loading } = useDesignContext();
  const dict = useTranslations("dict.designs.diffusion");

  return (
    <section className={styles.powerapp_container}>
      <h3 className={styles.subtitle}>{dict("title")}</h3>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div className={styles.hog_container}>
          {powerapps.length > 0 ? powerapps.map(hog => <HogCard key={hog._id} {...hog} />) : <p>{dict("empty")}</p>}
        </div>
      )}
    </section>
  );
};

export default PowerApp;
