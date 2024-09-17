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

  const templateError = (typedata?: string) => {
    if (listTemplates?.type !== "") {
      const type = listTemplates?.type || "";
      return locale === "en"
        ? `${dict("diffusion.empty")} ${type} ${typedata === "designs" ? dict("diffusion.designs") : dict("diffusion.title")} `
        : `${dict("diffusion.empty")} ${typedata === "designs" ? dict("diffusion.designs") : dict("diffusion.title")} ${type}  `;
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
          <div className={styles.cards}>
            <h3 className={styles.subtitle}>{templateTitle()}</h3>
            <div className={styles.card_container}>
              {listTemplates && listTemplates.hogs.length > 0 ? (
                listTemplates.hogs.map(item => (
                  <TemplateCard
                    key={item._id}
                    {...item}
                    datatype={listTemplates?.type !== "" ? undefined : "designs"}
                  />
                ))
              ) : (
                <p className={styles.empty_text}>{templateError()}</p>
              )}
            </div>
          </div>
          {listTemplates?.type !== "" && (
            <div className={styles.cards}>
              <h3 className={styles.subtitle}>{dict("create_design.create_diffusion")}</h3>
              <div className={styles.card_container}>
                {listTemplates && listTemplates.designs.length > 0 ? (
                  listTemplates.designs.map(item => <TemplateCard key={item._id} {...item} datatype='designs' />)
                ) : (
                  <p className={styles.empty_text}>{templateError("designs")}</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default TemplateList;
