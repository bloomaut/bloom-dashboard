import Image from "next/image";
import styles from "./styles.module.scss";
import green_check from "@/../public/icons/green_check.png";
import gray_check from "@/../public/icons/gray_check.png";

interface StepsProps {
  step_number: number;
  title: string;
  subtitle: string;
  isActive: boolean;
}

const Steps = ({ step_number, title, subtitle, isActive }: StepsProps) => {
  return (
    <div className={`${styles.container} ${isActive ? styles.active : styles.inactive}`}>
      <h1 className={styles.step_number}>{step_number}</h1>
      <div className={styles.text_container}>
        <h2>{title} </h2>
        <p>{subtitle} </p>
      </div>
      <div className={styles.check_container}>
        <Image
          src={isActive ? green_check : gray_check}
          alt={isActive ? "Green check" : "Gray check"}
          width={39}
          height={30}
        />
      </div>
    </div>
  );
};

export default Steps;
