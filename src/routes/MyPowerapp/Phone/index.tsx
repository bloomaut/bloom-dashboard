import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";
import Image from "next/image";
import caseImage from "@/../public/assets/playground_phonecase.png";

const Phone = () => {
  const dict = useTranslations("dict.business.my-powerapp");

  return (
    <div className={styles.container}>
      <div className={styles.inner_container}>
        <h2>{dict("chosen_templates")}</h2>
        <div className={styles.phone_container}>
          <Image src={caseImage} width={550} height={500} alt='' className={styles.phone} />
        </div>
      </div>
    </div>
  );
};

export default Phone;
