import styles from "./styles.module.scss";
import TemplateCard from "../TemplateCard";
import LoadingSpinner from "@/components/Loading";
import { useDesignContext } from "@/context/DesignContext";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const TemplateList = () => {
  const { listTemplates, loading } = useDesignContext();
  const dict = useTranslations("dict.designs");
  const locale = useLocale();

  const templateTitle = () => {
    if (listTemplates && listTemplates.type !== "") {
      const type = listTemplates?.type || "";
      return locale === "en" ? `${type} ${dict("diffusion.title")}` : `${dict("diffusion.title")} ${type}`;
    } else {
      return dict("header.my_designs");
    }
  };

  const templateError = () => {
    if (listTemplates?.type !== "") {
      const type = listTemplates?.type || "";
      return locale === "en"
        ? `${dict("diffusion.empty")} ${type} ${dict("diffusion.title")} `
        : `${dict("diffusion.empty")} ${dict("diffusion.title")} ${type}  `;
    } else return locale === "en" ? `${dict("diffusion.empty")} designs` : `${dict("diffusion.empty")} Diseños`;
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
            {listTemplates && listTemplates.data.length > 0 ? (
              listTemplates.data.map(item => <TemplateCard key={item._id} {...item} />)
            ) : (
              <p className={styles.empty_text}>{templateError()}</p>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default TemplateList;
