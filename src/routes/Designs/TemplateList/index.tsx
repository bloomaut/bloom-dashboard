import { useState } from "react";
import styles from "./styles.module.scss";
import TemplateCard from "../TemplateCard";
import LoadingSpinner from "@/components/Loading";
import Icon from "@/components/Icon";
import { useDesignContext } from "@/context/DesignContext";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const TemplateList = () => {
  const { listTemplates, loading } = useDesignContext();
  const [templateMode, setTemplateMode] = useState<string>("designs");
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

  const switchTemplateMode = (mode: string) => {
    setTemplateMode(mode);
  };

  return (
    <section className={styles.powerapp_container}>
      {loading ? (
        <div className={styles.spinner_container}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {templateMode === "designs" && listTemplates?.type !== "" && (
            <div className={styles.cards}>
              <h3 className={styles.subtitle}>{dict("create_design.create_diffusion")}</h3>
              <div className={styles.card_container}>
                <div className={styles.switch_card} onClick={() => switchTemplateMode("flakes")}>
                  <Icon name='add' viewBox='0 0 25 20' strokeColor='#282d7e' />
                  <p>Create new</p>
                </div>

                {listTemplates && listTemplates.designs.length > 0 ? (
                  listTemplates.designs.map(item => <TemplateCard key={item._id} {...item} datatype='designs' />)
                ) : (
                  <p className={styles.empty_text}>{templateError("designs")}</p>
                )}
              </div>
            </div>
          )}

          {templateMode === "flakes" && (
            <div className={styles.cards}>
              <h3 className={styles.subtitle}>{templateTitle()}</h3>
              <div className={styles.card_container}>
                <div className={styles.switch_card_v2} onClick={() => switchTemplateMode("designs")}>
                  <Icon name='arrow_left' viewBox='0 0 25 20' strokeColor='#282d7e' />
                </div>

                {listTemplates && listTemplates.flakes.length > 0 ? (
                  listTemplates.flakes.map(item => (
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
          )}
        </>
      )}
    </section>
  );
};

export default TemplateList;
