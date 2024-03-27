"use clients";
import styles from "./styles.module.scss";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useEffect, useState } from "react";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import { ENV } from "@/typescript/types/environment.enum";
import { get } from "@/services/fetch";
import Image from "next/image";
import HogIcon from "@/routes/Playground/TemplatesSelector/Icons/Hog";
//Componentes
import Loading from "@/app/[locale]/(playground)/introduction/loading";

const GalleryComponent = () => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifyError } = useMessageToast();
  const dict = useTranslations("dict.toast");

  useEffect(() => {
    const fetchData = async () => {
      const response = await get("small/flakes/user", ENV.UITOOL);
      if (response.statusCode === 200) {
        setFlakes(response.result.powerapps);
        setLoading(false);
      } else {
        notifyError(dict("error_tryagain"));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.flakes}>
        {!loading ? (
          flakes?.map((app: Powerapp) => (
            <div className={styles.template_container} key={app._id}>
              <h4 className={styles.title}>{app.skinx.title}</h4>
              <div className={styles.template}>
                <div className={styles.sm_card}>
                  {app.hog_related.thumbnail ? (
                    <Image src={app.hog_related.thumbnail} alt={app.skinx.title} width={167} height={120} />
                  ) : (
                    <HogIcon />
                  )}
                </div>
                <div className={styles.lg_card}>
                  {app.thumbnail && <Image src={app.thumbnail} alt={app.skinx.title} width={137} height={100} />}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.loader}>
            <Loading />
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryComponent;
