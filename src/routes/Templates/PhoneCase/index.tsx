import styles from "./styles.module.scss";
import Image from "next/image";
import caseImage from "@/../public/assets/playground_phonecase.png";
import { useTemplateContex } from "@/context/TemplatesContext";
import LoadingSpinner from "@/components/Loading";

const PhoneCase = () => {
  const { previewId, previewLoading, setPreviewLoading } = useTemplateContex();

  return (
    <div className={styles.phone_container}>
      <Image src={caseImage} alt='Phone case' className={styles.phone} />
      {previewLoading && (
        <div className={styles.iframe}>
          <LoadingSpinner />
        </div>
      )}
      {previewId && (
        <iframe className={styles.iframe} src={previewId} title='Power App' onLoad={() => setPreviewLoading(false)} />
      )}
    </div>
  );
};

export default PhoneCase;
