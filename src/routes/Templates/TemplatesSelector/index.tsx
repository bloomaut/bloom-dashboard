import styles from "./styles.module.scss";
import Image from "next/image";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";
import { Fade } from "react-awesome-reveal";
import { get } from "@/services/fetch";
import { useEffect, useState } from "react";
import { useMessageToast } from "@/hooks/useMessageToast";
// Components
import LoadingSpinner from "@/components/Loading";
import flake_icon_01 from "/public/flake_icon_01.svg";
import flake_icon_02 from "/public/flake_icon_02.svg";

const TemplatesSelector = () => {
  const dict = useTranslations("dict.templates");
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlakeId, setSelectedFlakeId] = useState("");
  const { notifyError } = useMessageToast();

  const fetchDataHotlink = async () => {
    const response = await get("small/flakes/user");
    if (response.statusCode === 200) {
      setFlakes(response.result.powerapps);
      setLoading(false);
    } else {
      notifyError(dict("error_tryagain"));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataHotlink();
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.flakes}>
        {!loading ? (
          flakes?.map((app: Powerapp) => (
            <Fade triggerOnce key={app._id}>
              <div className={styles.template_container}>
                <h4 className={styles.title}>{app.skinx.title}</h4>
                <div
                  className={styles.template}
                  style={{ border: selectedFlakeId === app._id ? "3px solid #282e7ebd" : "3px solid transparent" }}
                >
                  <>
                    <div className={styles.sm_card}>
                      {app.hog_related.thumbnail ? (
                        <Image src={app.hog_related.thumbnail} alt={app.skinx.title} width={167} height={120} />
                      ) : (
                        <Image className={styles.empty_img} src={flake_icon_02} alt='Icon' />
                      )}
                    </div>
                    <div className={styles.lg_card}>
                      {app.thumbnail ? (
                        <Image src={app.thumbnail} alt={app.skinx.title} width={137} height={100} />
                      ) : (
                        <Image className={styles.empty_img} src={flake_icon_01} alt='Icon' />
                      )}
                    </div>
                    <div className={styles.hover}>
                      <button className={styles.preview}>Preview</button>
                      <button className={styles.select} onClick={() => setSelectedFlakeId(app._id)}>
                        {dict("select")}
                      </button>
                    </div>
                  </>
                </div>
              </div>
            </Fade>
          ))
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </section>
  );
};

export default TemplatesSelector;
