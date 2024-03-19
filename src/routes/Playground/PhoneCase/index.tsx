import styles from "./styles.module.scss";
import Image from "next/image";
import caseImage from "@/../public/assets/mobileCase.png";
import whatsappImage from "@/../public/assets/wa.png";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
//Componentes
import LoadingDots from "./LoadingDots";
import LoadingSpinner from "@/components/Loading";
import OpenGraph from "./OpenGraph";

interface PhoneCaseProps {
  loadingDots: boolean;
}

const PhoneCase = ({ loadingDots }: PhoneCaseProps) => {
  const { captureTime, showPreview, setShowPreview, previewData, paUrl, loading } = useFlakesContext();
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    if (!loading && paUrl && !showPreview) {
      setIframeLoading(false);
    } else {
      setIframeLoading(true);
    }
  }, [paUrl, showPreview, loading]);
  return (
    <div className={styles.container}>
      <div className={styles.phone_container}>
        <Image src={caseImage} width={550} height={500} alt='Phone case' className={styles.phone} />
        <Image src={whatsappImage} width={250} height={500} alt='Whatsapp' className={styles.wa} />
        <div className={styles.phone_inner_container}>
          {loadingDots ? (
            <LoadingDots />
          ) : (
            <>
              {showPreview && previewData && (
                <OpenGraph
                  handlePreviewClick={() => setShowPreview(false)}
                  previewData={previewData}
                  captureTime={captureTime}
                />
              )}

              {!showPreview && (
                <>{iframeLoading ? <LoadingSpinner /> : <iframe src={paUrl} title='Power App'></iframe>}</>
              )}

              {/*  {!showPreview && iframeLoading && <LoadingSpinner />}
              {!showPreview && !iframeLoading && <iframe src={paUrl} title='Power App'></iframe>} */}
            </>
          )}
        </div>
      </div>
      <div className={styles.dot_container}>
        <span
          onClick={() => setShowPreview(true)}
          className={`${styles.dot} ${showPreview ? styles.dot_active : styles.dot_inactive}`}
        ></span>
        <span
          onClick={() => setShowPreview(false)}
          className={`${styles.dot} ${!showPreview ? styles.dot_active : styles.dot_inactive}`}
        ></span>
      </div>
    </div>
  );
};

export default PhoneCase;
