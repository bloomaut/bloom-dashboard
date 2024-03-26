import styles from "./styles.module.scss";

interface Content {
  name: string;
  date: string;
  name_skin: string;
  template: string;
  total: number;
  open: number;
}
interface ContentProps {
  content: Content;
}

const Content = ({ content }: ContentProps) => {
  return (
    <div className={styles.content}>
      <div className={styles.subtitle_one}>
        <p>{content.name}</p>
        <p>{content.date}</p>
      </div>
      <div className={styles.subtitle_two}>
        <p>{content.name_skin}</p>
        <p>{content.template}</p>
      </div>
      <div className={styles.subtitle_three}>
        <p>{content.total}</p>
        <p>{content.open}</p>
      </div>
    </div>
  );
};

export default Content;
