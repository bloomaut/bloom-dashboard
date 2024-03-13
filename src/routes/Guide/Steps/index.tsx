import Image from "next/image";
import styles from "./styles.module.scss";
import green_check from "@/../public/icons/green_check.png";
import gray_check from "@/../public/icons/gray_check.png";
import Link from "next/link";

interface StepsProps {
  step_number: number;
  title: string;
  subtitle: string;
  isActive: boolean;
  linkTo: string;
}

const Steps = ({ step_number, title, subtitle, isActive, linkTo }: StepsProps) => {
  return (
    <Link href={linkTo}>
      <div className={`${styles.main_container} ${isActive ? styles.active : styles.inactive}`}>
        <span className={styles.step_number}>{step_number}</span>
        <div className={styles.container}>
          <div className={styles.text_container}>
            <h1>{title} </h1>
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
      </div>
    </Link>
  );
};

export default Steps;
