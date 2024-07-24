import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useCatalogContext } from "@/context/CatalogContext";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { ENV } from "@/typescript/types/api";
import { get, post } from "@/services/fetch";
import { useEffect, useState } from "react";
//Components
import Button from "@/components/Button";
import Title from "@/components/Title";
import Catalogs from "./Catalogs";
import BusinessInfo from "./BusinessInfo";
import LogoBanner from "./LogoBanner";
import LoadingSpinner from "@/components/Loading";
import PopupChildren from "@/components/PopupChildren";
import PopupSuccess from "./PopupSuccess";
import PhoneCase from "@/components/PhoneCase";
import { useMessageToast } from "@/hooks/useMessageToast";

const MyPowerapp = () => {
  const userData = useAppSelector(state => state.userData);
  const dict = useTranslations("dict.business.my-powerapp");
  const { datasets, loading } = useCatalogContext();
  const [url, setUrl] = useState("");
  const [loadingPhone, setLoadingPhone] = useState(true);
  const [popupGenerate, setPopupGenerate] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);
  const [loadingPopup, setLoadingPopup] = useState<boolean>(false);
  const { notifyError } = useMessageToast();

  useEffect(() => {
    const { notifyError } = useMessageToast();
    setLoadingPhone(true);
    const getTemplate = async (id: string) => {
      const response = await get(`small-template/${id}`);
      if (response.statusCode === 200) {
        const idPowerapp = response.result.template.skinx_demo.powerapp[0]._id;
        setUrl(`${process.env.NEXT_PUBLIC_ENGINE_URL}/preview/powerapp/${idPowerapp}`);
      } else {
        notifyError("error");
      }
      setLoadingPhone(false);
    };

    if (userData.client.onboardings) {
      const id = userData.client.onboardings[0].skinx_template._id;
      getTemplate(id);
    }
  }, [userData]);

  //console.log(userData);
  const postOnboarding = async (template_id: string, onboarding_id: string) => {
    setLoadingPopup(true);
    const postedOnboarding = {
      template_id,
      onboarding_id,
    };

    const response = await post("skinx-generator", postedOnboarding, ENV.TOOL);
    if (response.data.statusCode !== 201) {
      notifyError(dict("error_generate"));
      setLoadingPopup(false);
      return false;
    }
    setLoadingPopup(false);
    return true;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const template_id = userData.client.onboardings?.[0].skinx_template._id;
    const onboarding_id = userData.client.onboardings?.[0]._id;
    if (template_id && onboarding_id) {
      const post = await postOnboarding(template_id, onboarding_id);
      setPopupGenerate(false);
      if (post) setPopupSuccess(true);
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
        <PhoneCase loading={loadingPhone} previewId={url} setPreviewLoading={setLoadingPhone} />
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
          loading={loadingPopup}
        >
          <p className={styles.generate_popup}>{dict("generate_popup_subtitle")}</p>
        </PopupChildren>
      )}
      {popupSuccess && <PopupSuccess setShowConfirmation={setPopupSuccess} />}
    </section>
  );
};

export default MyPowerapp;
