"use clients";
import styles from "./styles.module.scss";
import Image from "next/image";
import HogIcon from "@/routes/Playground/TemplatesSelector/Icons/Hog";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useFlakeData } from "@/hooks/useFlakesUser";
//Componentes
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import PwaIcon from "@/routes/Hotlink/Select/Icon/Pwa";
import { useTranslations } from "next-intl";

const GalleryComponent = () => {
  const { flakes, loading } = useFlakeData();
  const dict = useTranslations("dict.gallery");

  return (
    <section className={styles.container}>
      <div className={styles.flakes}>
        {!loading ? (
          <>
            {flakes.length ? (
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
                      {app.thumbnail ? (
                        <Image src={app.thumbnail} alt={app.skinx.title} width={137} height={100} />
                      ) : (
                        <PwaIcon />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>{dict("empty_designs")}</p>
            )}
          </>
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
