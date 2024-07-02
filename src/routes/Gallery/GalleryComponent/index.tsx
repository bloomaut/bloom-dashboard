"use clients";
import styles from "./styles.module.scss";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useFlakeData } from "@/hooks/useFlakesUser";
import { useTranslations } from "next-intl";
import { Fade } from "react-awesome-reveal";
import { useState } from "react";
import { useMessageToast } from "@/hooks/useMessageToast";
// Components
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import PopupImage from "@/components/PopupImage";
import FlakeGallery from "@/components/FlakeGallery";

const GalleryComponent = () => {
  const { flakes, loading } = useFlakeData();
  const [selectedImage, setSelectedImage] = useState<{ url: string; type: string } | null>(null);
  const dict = useTranslations("dict.gallery");
  const { notifyError } = useMessageToast();

  const handleClick = (url: string, type: string) => {
    console.log("url", url, "type", type);
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
              flakes?.map((app: Powerapp) => <FlakeGallery app={app} handleClick={handleClick} />)
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
