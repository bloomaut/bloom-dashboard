import styles from "./styles.module.scss";
import Link from "next/link";
import Icon from "@/components/Icon";

interface CardStepsProps {
  step_number: number;
  title: string;
  subtitle: string;
  isActive: boolean;
  linkTo: string;
}

const CardSteps = ({ step_number, title, subtitle, isActive, linkTo }: CardStepsProps) => {
  return (
    <Link href={linkTo} className={`${styles.main_container} ${!isActive && styles.inactive}`}>
      <div className={styles.container}>
        <span className={styles.step_number}>{step_number}</span>
        <div className={styles.text_container}>
          <h2>{title} </h2>
          <p>{subtitle} </p>
        </div>
      </div>
      <div className={styles.check_container}>
        <Icon
          name='check'
          width={45}
          height={45}
          viewBox='0 0 45 15'
          strokeWidth={4}
          strokeColor={isActive ? "#00BD35" : "#bebebe"}
        />
      </div>
    </Link>
  );
};

export default CardSteps;
