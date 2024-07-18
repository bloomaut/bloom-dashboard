import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";
import Image from "next/image";
import phone from "/public/assets/phone.png";

const Phone = () => {
  const dict = useTranslations("dict.business.my-powerapp");

  return (
    <div className={styles.container}>
      <div className={styles.inner_container}>
        <h2>{dict("chosen_templates")}</h2>
        <Image src={phone} alt='phone' width={250} />
      </div>
    </div>
  );
};

export default Phone;
