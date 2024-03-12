import styles from "./styles.module.scss";

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
    </div>
  );
};

export default Steps;
