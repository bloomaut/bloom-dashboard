"use clients";
import styles from "./styles.module.scss";
import Image from "next/image";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useFlakeData } from "@/hooks/useFlakesUser";
import { useTranslations } from "next-intl";
import { Fade } from "react-awesome-reveal";
import { useState } from "react";
import { useMessageToast } from "@/hooks/useMessageToast";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
// Components
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import PopupImage from "@/components/PopupImage";
import Icon from "@/components/Icon";

const GalleryComponent = () => {
  const { flakes, loading } = useFlakeData();
  const [selectedImage, setSelectedImage] = useState<{ url: string; type: string } | null>(null);
  const dict = useTranslations("dict.gallery");
  const { notifyError } = useMessageToast();

  const handleClick = (url: string, type: string) => {
    if (url && type === "hog")
      setSelectedImage(prevState => {
        if (prevState?.url === url && prevState.type === type) {
          return prevState;
        }
        return { url, type };
      });
    else if (url === null) {
      notifyError(dict("error"));
    }
  };

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
                        <Icon
                          name='hog'
                          width={40}
                          height={40}
                          fillColor='#7f7f7f'
                          strokeColor='#7f7f7f'
                          strokeWidth={0.5}
                        />
                      )}
                    </div>
                    <div className={styles.lg_card} onClick={() => handleClick(app.thumbnail, "powerapp")}>
                      {app.thumbnail ? (
                        <Zoom classDialog='custom-zoom'>
                          <Image
                            src={app.thumbnail}
                            alt={app.skinx.title}
                            className={styles.image}
                            width={800}
                            height={800}
                            priority
                          />
                        </Zoom>
                      ) : (
                        <Icon
                          name='pwa'
                          width={80}
                          height={80}
                          fillColor='#7f7f7f'
                          strokeColor='#7f7f7f'
                          strokeWidth={0.1}
                          viewBox='0 0 109 127'
                        />
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
