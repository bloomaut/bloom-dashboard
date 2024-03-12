import styles from "./styles.module.scss";

interface StepsProps {
  step_number: number;
  title: string;
  subtitle: string;
}

const Steps: React.FC<StepsProps> = ({ step_number, title, subtitle }) => {
  return (
    <div>
      <h1>{step_number}</h1>
      <h2>{title} </h2>
      <p>{subtitle} </p>
    </div>
  );
};

export default Steps;
