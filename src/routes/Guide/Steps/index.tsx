import Image from "next/image";
import styles from "./styles.module.scss";
import green_check from "@/../public/icons/green_check.png";

interface StepsProps {
  step_number: number;
  title: string;
  subtitle: string;
}

const Steps = ({ step_number, title, subtitle }: StepsProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.step_number}>{step_number}</h1>
      <div className={styles.text_container}>
        <h2>{title} </h2>
        <p>{subtitle} </p>
      </div>
      <div className={styles.check_container}>
        <Image src={green_check} alt='Green check' width={39} height={30} />
      </div>
    </div>
  );
};

export default Steps;
