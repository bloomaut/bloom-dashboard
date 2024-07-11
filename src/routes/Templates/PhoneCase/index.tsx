import styles from "./styles.module.scss";
import Image from "next/image";
import caseImage from "@/../public/assets/playground_phonecase.png";

const PhoneCase = () => {
  return (
    <div className={styles.container}>
      <div className={styles.phone_container}>
        <Image src={caseImage} alt='Phone case' className={styles.phone} />
      </div>
    </div>
  );
};

export default PhoneCase;
