import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useCatalogContext } from "@/context/CatalogContext";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import Link from "next/link";
//Components
import Button from "@/components/Button";
import Title from "@/components/Title";
import Catalogs from "./Catalogs";
import Phone from "./Phone";
import BusinessInfo from "./BusinessInfo";
import LogoBanner from "./LogoBanner";
import LoadingSpinner from "@/components/Loading";
import PopupChildren from "@/components/PopupChildren";
import PopupSuccess from "./PopupSuccess";

const MyPowerapp = () => {
  const userData = useAppSelector(state => state.userData);
  const dict = useTranslations("dict.business.my-powerapp");
  const { datasets, loading, postOnboarding } = useCatalogContext();
  const [popupGenerate, setPopupGenerate] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);

  //console.log(userData);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const template_id = userData.client.onboardings?.[0].skinx_template._id;
    const onboarding_id = userData.client.onboardings?.[0]._id;
    if (template_id && onboarding_id) {
      const post = await postOnboarding(template_id, onboarding_id);
      if (!loading) {
        setPopupGenerate(false);
        setPopupSuccess(true);
      }
    }
  };

  return (
    <section className={styles.container}>
      <div>
        <Title text={dict("title")} />
        <p className={styles.subtitle}>{dict("subtitle")}</p>
      </div>
      <div className={styles.inner_container}>
        <div className={styles.business}>
          <h4 className={styles.title}>{dict("business_title")}</h4>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className={styles.data_container}>
                <BusinessInfo title={dict("name")} value={userData.name!} />
                <BusinessInfo title={dict("last_name")} value={userData.lastname!} />
                <BusinessInfo title={dict("business_name")} value={userData.client.name!} />
              </div>
              <LogoBanner logo={userData.client.logo} banner={userData.client.banner} />
              <BusinessInfo title={dict("category")} value={userData.client.category!} />
              <BusinessInfo title={dict("business_description")} value={userData.client.description!} />
              <div className={styles.container_circle}>
                <h6>{dict("colors")}</h6>
                <div className={styles.colors}>
                  {userData.client.palette?.map((color, index) => (
                    <article key={index} className={styles.circle} style={{ backgroundColor: color.color }}></article>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <Catalogs datasets={datasets} loading={loading} />
        <Phone />
      </div>
      <div className={styles.button}>
        <Link className={styles.btn} href='/my-business'>
          {dict("button")}
        </Link>
        <Button title={dict("button_generate")} onclick={() => setPopupGenerate(true)} />
      </div>
      {popupGenerate && (
        <PopupChildren
          title={dict("generate_popup_title")}
          textAccept={dict("create")}
          textCancel={dict("cancel")}
          onCancel={() => setPopupGenerate(false)}
          onConfirm={handleGenerate}
          setShowConfirmation={setPopupGenerate}
          loading={loading}
        >
          <p className={styles.generate_popup}>{dict("generate_popup_subtitle")}</p>
        </PopupChildren>
      )}
      {popupSuccess && <PopupSuccess setShowConfirmation={setPopupSuccess} />}
    </section>
  );
};

export default MyPowerapp;
