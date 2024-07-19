import styles from "./styles.module.scss";
import Image from "next/image";
import caseImage from "@/../public/assets/playground_phonecase.png";
import { useTemplateContext } from "@/context/TemplatesContext";
import LoadingSpinner from "@/components/Loading";

const PhoneCase = () => {
  const { previewId, previewLoading, setPreviewLoading } = useTemplateContext();

  return (
    <div className={styles.phone_container}>
      <Image src={caseImage} alt='Phone case' className={styles.phone} />
      {previewLoading && (
        <div className={styles.iframe_container}>
          <LoadingSpinner />
        </div>
      )}
      {previewId && (
        <div className={styles.iframe_container}>
          <iframe className={styles.iframe} src={previewId} title='Power App' onLoad={() => setPreviewLoading(false)} />
        </div>
      )}
    </div>
  );
};

export default PhoneCase;
