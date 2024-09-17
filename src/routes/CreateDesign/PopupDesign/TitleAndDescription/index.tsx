import styles from "./styles.module.scss";

interface Props {
  title: string;
  description: string;
}
const TitleAndDescription = ({ title, description }: Props) => {
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default TitleAndDescription;
