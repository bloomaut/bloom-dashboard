import styles from "./styles.module.scss";

interface Props {
  title: string;
  value: string;
}

const BusinessInfo = ({ title, value }: Props) => {
  return (
    <div className={styles.info}>
      <p className={styles.data_title}>{title}</p>
      <p className={styles.data_value}>{value}</p>
    </div>
  );
};

export default BusinessInfo;
