import { useState } from "react";
import styles from "./styles.module.scss";
import TemplateCard from "../TemplateCard";
import LoadingSpinner from "@/components/Loading";
import Icon from "@/components/Icon";
import { useDesignContext } from "@/context/DesignContext";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const TemplateList = () => {
  const { listTemplates, selectedList, loading } = useDesignContext();
  const [templateMode, setTemplateMode] = useState<string>("designs");
  const dict = useTranslations("dict.designs");
  const locale = useLocale();

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
          {templateMode === "designs" && selectedList === "hog" && listTemplates?.difussionHogs && (
            <div className={styles.cards}>
              <h3 className={styles.subtitle}>Share now!</h3>
              <div className={styles.card_container}>
                {listTemplates && listTemplates.difussionHogs.length > 0 ? (
                  listTemplates.difussionHogs.map(hog => (
                    <TemplateCard key={hog._id} {...hog} datatype='diffusion' selectedList={selectedList} />
                  ))
                ) : (
                  <p className={styles.empty_text}>You do not have diffusion links to share yet</p>
                )}
              </div>
            </div>
          )}

          {templateMode === "designs" && selectedList === "post" && listTemplates?.genericPosts && (
            <div className={styles.cards}>
              <h3 className={styles.subtitle}>Share now!</h3>
              <div className={styles.card_container}>
                {listTemplates && listTemplates.genericPosts.length > 0 ? (
                  listTemplates.genericPosts.map(post => (
                    <TemplateCard key={post._id} {...post} datatype='genericPost' selectedList={selectedList} />
                  ))
                ) : (
                  <p className={styles.empty_text}>You do not have generic posts to download yet</p>
                )}
              </div>
            </div>
          )}

          {templateMode === "designs" && selectedList !== "landing" && (
            <div className={styles.cards}>
              <h3 className={styles.subtitle}>Custom designs</h3>
              <div className={styles.card_container}>
                <div
                  className={`${styles.switch_card} ${selectedList === "landing" ? styles.disable_switch : ""}`}
                  onClick={() => switchTemplateMode("flakes")}
                >
                  <Icon name='add' viewBox='0 0 25 20' strokeColor='#282d7e' />
                  <p>Create new</p>
                </div>

                {listTemplates && listTemplates.designs.length > 0 ? (
                  listTemplates.designs.map(item => (
                    <TemplateCard key={item._id} {...item} datatype='designs' selectedList={selectedList} />
                  ))
                ) : (
                  <p className={styles.empty_text}>You do not have designs created yet</p>
                )}
              </div>
            </div>
          )}

          {selectedList === "landing" && (
            <div className={styles.cards}>
              <h3 className={styles.subtitle}>You websites</h3>
              <div className={styles.card_container}>
                {listTemplates && listTemplates.flakes.length > 0 ? (
                  listTemplates.flakes.map(item => (
                    <TemplateCard key={item._id} {...item} datatype={"designs"} selectedList={selectedList} />
                  ))
                ) : (
                  <p className={styles.empty_text}>Yo do not have websites yet</p>
                )}
              </div>
            </div>
          )}

          {templateMode === "flakes" && (
            <div className={styles.cards}>
              <h3 className={styles.subtitle}>Select template to create a new design</h3>
              <div className={styles.card_container}>
                <div className={styles.switch_card_v2} onClick={() => switchTemplateMode("designs")}>
                  <Icon name='arrow_left' viewBox='0 0 25 20' strokeColor='#282d7e' />
                </div>

                {listTemplates && listTemplates.flakes.length > 0 ? (
                  listTemplates.flakes.map(item => (
                    <TemplateCard key={item._id} {...item} datatype={"flakes"} selectedList={selectedList} />
                  ))
                ) : (
                  <p className={styles.empty_text}>Yo do not have templates to create designs yet</p>
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
