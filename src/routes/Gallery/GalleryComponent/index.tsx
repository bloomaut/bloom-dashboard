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
import { Fade } from "react-awesome-reveal";
import { useEffect, useState } from "react";
import PopupImage from "@/components/PopupImage";
import { useMessageToast } from "@/hooks/useMessageToast";

const GalleryComponent = () => {
  const { flakes, loading } = useFlakeData();
  const [selectedImage, setSelectedImage] = useState<{ url: string; type: string } | null>(null);
  const dict = useTranslations("dict.gallery");
  const { notifyError } = useMessageToast();

  const handleClick = (url: string, type: string) => {
    setSelectedImage(prevState => {
      if (prevState?.url === url && prevState.type === type) {
        return prevState;
      }
      return { url, type };
    });
  };

  useEffect(() => {
    if (selectedImage && !selectedImage.url) {
      notifyError("No hay imagen disponible");
    }
  }, [selectedImage]);

  return (
    <section className={styles.container}>
      <div className={styles.flakes}>
        {!loading ? (
          <Fade cascade damping={0.1} triggerOnce>
            {flakes.length ? (
              flakes?.map((app: Powerapp) => (
                <div className={styles.template_container} key={app._id}>
                  <h4 className={styles.title}>{app.skinx.title}</h4>
                  <div className={styles.template}>
                    <div className={styles.sm_card} onClick={() => handleClick(app.hog_related.thumbnail, "hog")}>
                      {app.hog_related.thumbnail ? (
                        <Image src={app.hog_related.thumbnail} alt={app.skinx.title} width={167} height={120} />
                      ) : (
                        <HogIcon />
                      )}
                    </div>
                    <div className={styles.lg_card} onClick={() => handleClick(app.thumbnail, "powerapp")}>
                      {app.thumbnail ? (
                        <Image
                          src={app.thumbnail}
                          alt={app.skinx.title}
                          className={styles.image}
                          width={137}
                          height={100}
                          priority
                        />
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
          </Fade>
        ) : (
          <div className={styles.loader}>
            <Loading />
          </div>
        )}
      </div>
      {selectedImage && selectedImage.url && (
        <PopupImage image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </section>
  );
};

export default GalleryComponent;
