import styles from "./styles.module.scss";
import TemplateCard from "../TemplateCard";
import LoadingSpinner from "@/components/Loading";
import { useDesignContext } from "@/context/DesignContext";
import { useTranslations } from "next-intl";

const TemplateList = () => {
  const { listTemplates, loading } = useDesignContext();
  const dict = useTranslations("dict.designs.diffusion");

  return (
    <section className={styles.powerapp_container}>
      <h3 className={styles.subtitle}>{dict("title")}</h3>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div className={styles.card_container}>
          {listTemplates.length > 0 ? (
            listTemplates.map(i => <TemplateCard key={i._id} {...i} />)
          ) : (
            <p>{dict("empty")}</p>
          )}
        </div>
      )}
    </section>
  );
};

export default TemplateList;
