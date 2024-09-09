import styles from "./styles.module.scss";
import TemplateCard from "../TemplateCard";
import LoadingSpinner from "@/components/Loading";
import { useDesignContext } from "@/context/DesignContext";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const TemplateList = () => {
  const { listTemplates, loading } = useDesignContext();
  const dict = useTranslations("dict.designs.diffusion");
  const locale = useLocale();

  const templateTitle = () => {
    if (listTemplates.length > 0 && listTemplates[0].type !== "") {
      const type = listTemplates[0]?.type || "";
      return locale === "en" ? `${type} ${dict("title")}` : `${dict("title")} ${type}`;
    }
    return "";
  };

  const templateError = () => {
    if (listTemplates && listTemplates[0].type !== "") {
      const type = listTemplates[0]?.type || "";
      return locale === "en"
        ? `${dict("empty")} ${type} ${dict("title")} `
        : `${dict("empty")} ${dict("title")} ${type}  `;
    }
    return "";
  };

  return (
    <section className={styles.powerapp_container}>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <h3 className={styles.subtitle}>{templateTitle()}</h3>
          <div className={styles.card_container}>
            {listTemplates.length > 0 && listTemplates[0].data.length > 0 ? (
              listTemplates.map(template => template.data.map(item => <TemplateCard key={item._id} {...item} />))
            ) : (
              <p>{templateError()}</p>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default TemplateList;
