import Image from "next/image";
import styles from "./styles.module.scss";
import caseImage from "@/../public/assets/mobileCase.png";
import whatsappImage from "@/../public/assets/wa.png";
import OpenGraph from "./OpenGraph";

interface PropsPhoneCase {
  previewData: any;
  showPreview: boolean;
  url: string;
  setShowPreview: (showPreview: boolean) => void;
  captureTime: string;
}

const PhoneCase = ({ previewData, showPreview, url, setShowPreview, captureTime }: PropsPhoneCase) => {
  return (
    <div className={styles.container}>
      <div className={styles.phone_container}>
        <Image src={caseImage} width={550} height={500} alt='Phone case' className={styles.phone} />
        <Image src={whatsappImage} width={250} height={500} alt='Whatsapp' className={styles.wa} />
        <div className={styles.phone_inner_container}>
          {/* OG */}
          {showPreview && previewData && (
            <OpenGraph
              handlePreviewClick={() => setShowPreview(false)}
              previewData={previewData}
              captureTime={captureTime}
            />
          )}
          {/* IFRAME */}
          {!showPreview && <iframe src={url} title='Power App'></iframe>}
        </div>
      </div>
    </div>
  );
};

export default PhoneCase;
