import Image from "next/image";
import styles from "./styles.module.scss";
import caseImage from "@/../public/assets/mobileCase.png";
import whatsappImage from "@/../public/assets/wa.png";
import OpenGraph from "./OpenGraph";
import { useFlakesContext } from "@/context/FlakesContext";
import LoadingDots from "./OpenGraph/LoadingDots";

interface PhoneCaseProps {
  loading: boolean;
}

const PhoneCase = ({ loading }: PhoneCaseProps) => {
  const { captureTime, showPreview, setShowPreview, previewData, paUrl } = useFlakesContext();

  return (
    <div className={styles.container}>
      <div className={styles.phone_container}>
        <Image src={caseImage} width={550} height={500} alt='Phone case' className={styles.phone} />
        <Image src={whatsappImage} width={250} height={500} alt='Whatsapp' className={styles.wa} />
        <div className={styles.phone_inner_container}>
          {loading ? (
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
              {!showPreview && <iframe src={paUrl} title='Power App'></iframe>}
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
