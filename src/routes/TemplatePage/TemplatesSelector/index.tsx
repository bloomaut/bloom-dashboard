import styles from "./styles.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Fade } from "react-awesome-reveal";
import { useEffect, useState } from "react";
import { useTemplateContext } from "@/context/TemplatesContext";
import { Template } from "@/typescript/interfaces/template.interface";
import { useSelector } from "react-redux";
import { update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
// Components
import LoadingSpinner from "@/components/Loading";
import flake_icon_01 from "/public/flake_icon_01.svg";
import flake_icon_02 from "/public/flake_icon_02.svg";

const TemplatesSelector = () => {
  const dict = useTranslations("dict");
  const onboardings = useSelector((state: UserBusiness) => state.userData?.client?.onboardings);
  const [onboardingId, setOnboardingId] = useState("");
  const { templates, loading, selectedTemplateId, setSelectedTemplateId, setPreviewId, setPreviewLoading } =
    useTemplateContext();
  const { notify, notifyError } = useMessageToast();

  useEffect(() => {
    if (onboardings && onboardings.length > 0) {
      setOnboardingId(onboardings[0]._id);
    }
  }, [onboardings]);

  const handleSubmitPut = async (skinx_id: string, template_id: string, powerapp_id: string) => {
    const response = await update("small-template/onboarding", { skinx_id, template_id }, onboardingId);
    if (response.statusCode === 200) {
      notify(dict("toast.success_template"));
    } else {
      notifyError(dict("toast.error_template"));
    }

    handleShowPreview(powerapp_id);
  };

  const handleShowPreview = (powerapp_id: string) => {
    const url = `${process.env.NEXT_PUBLIC_ENGINE_URL}/preview/powerapp/${powerapp_id}`;
    setPreviewId(url);
    setPreviewLoading(true);
  };

  return (
    <section className={styles.container}>
      <div className={styles.flakes}>
        {loading ? (
          <LoadingSpinner />
        ) : templates.length > 0 ? (
          templates.map((app: Template) => (
            <Fade triggerOnce key={app._id}>
              <div className={styles.template_container}>
                <h4 className={styles.title}>{app.skinx_demo.title}</h4>
                <div
                  className={styles.template}
                  style={{ border: selectedTemplateId === app._id ? "3px solid #282e7ebd" : "3px solid transparent" }}
                >
                  <div className={styles.sm_card}>
                    {app.skinx_demo.powerapp[0].hog_related.thumbnail ? (
                      <Image
                        src={app.skinx_demo.powerapp[0].hog_related.thumbnail}
                        alt={app.skinx_demo.title}
                        width={167}
                        height={120}
                      />
                    ) : (
                      <Image className={styles.empty_img} src={flake_icon_02} alt='Icon' />
                    )}
                  </div>
                  <div className={styles.lg_card}>
                    {app.skinx_demo.powerapp[0].thumbnail ? (
                      <Image
                        src={app.skinx_demo.powerapp[0].thumbnail}
                        alt={app.skinx_demo.title}
                        width={137}
                        height={100}
                      />
                    ) : (
                      <Image className={styles.empty_img} src={flake_icon_01} alt='Icon' />
                    )}
                  </div>
                  <div className={styles.hover}>
                    <button
                      className={styles.preview}
                      onClick={() => handleShowPreview(app.skinx_demo.powerapp[0]._id)}
                    >
                      Preview
                    </button>
                    <button
                      className={styles.select}
                      onClick={() => {
                        setSelectedTemplateId(app._id);
                        handleSubmitPut(app.skinx_demo._id, app._id, app.skinx_demo.powerapp[0]._id);
                      }}
                    >
                      {dict("templates.select")}
                    </button>
                  </div>
                </div>
              </div>
            </Fade>
          ))
        ) : (
          <p>{dict("templates.empty")}</p>
        )}
      </div>
    </section>
  );
};

export default TemplatesSelector;
