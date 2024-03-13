import styles from "./styles.module.scss";

interface Steps2Props {
  userStep: number;
}

const Step2 = ({ userStep }: Steps2Props) => {
  return <div className={styles.container}>paso 2</div>;
};

export default Step2;
