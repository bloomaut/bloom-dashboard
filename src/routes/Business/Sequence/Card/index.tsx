import styles from "./styles.module.scss";
import { ContentProps } from "..";

interface CardProps {
  data: ContentProps;
  disabled?: boolean;
}

const Card = ({ data, disabled }: CardProps) => {
  return (
    <div className={disabled ? styles.container : styles.container_disabled}>
      <div className={styles.header}>
        <p className={styles.step}>{data.step}.</p>
        <h3 className={styles.title}>{data.title}</h3>
      </div>
      <p className={styles.description}>{data.description}</p>
    </div>
  );
};

export default Card;
