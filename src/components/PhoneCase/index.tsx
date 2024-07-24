import styles from "./styles.module.scss";
import Image from "next/image";
import caseImage from "@/../public/assets/phonecase.png";
import LoadingSpinner from "@/components/Loading";

interface PhoneCaseProps {
  loading?: boolean;
  previewId?: string;
  setPreviewLoading: (arg0: boolean) => void;
}

const PhoneCase = ({ loading, previewId, setPreviewLoading }: PhoneCaseProps) => {
  return (
    <div className={styles.column_container}>
      <div className={styles.phone_container}>
        <Image src={caseImage} alt='Phone case' width={804} height={1570} className={styles.phone} />

        {loading && (
          <div className={styles.iframe_container}>
            <LoadingSpinner />
          </div>
        )}
        {previewId && (
          <div className={styles.iframe_container}>
            <iframe
              className={styles.iframe}
              src={previewId}
              title='Power App'
              onLoad={() => setPreviewLoading(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneCase;
