import styles from "./styles.module.scss";
import Image from "next/image";
import caseImage from "@/../public/assets/mobileCase.png";
import whatsappImage from "@/../public/assets/wa.png";
import { useState } from "react";
//Componentes
import LoadingDots from "./LoadingDots";
import LoadingSpinner from "@/components/Loading";
import OpenGraph from "./OpenGraph";
import { useOpenGraphContext } from "@/context/OpenGraphContext";

const PhoneCase = () => {
  const { captureTime, showPreview, setShowPreview, previewData, paUrl, loadingDots } = useOpenGraphContext();
  const [iframeLoading, setIframeLoading] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.phone_container}>
        <Image src={caseImage} width={550} height={500} alt='Phone case' className={styles.phone} />
        {showPreview && <Image src={whatsappImage} width={250} height={500} alt='Whatsapp' className={styles.wa} />}
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

              {!showPreview && iframeLoading && <LoadingSpinner />}

              {!showPreview && <iframe onLoad={() => setIframeLoading(false)} src={paUrl} title='Power App'></iframe>}
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
