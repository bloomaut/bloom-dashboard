import styles from "./styles.module.scss";

interface SubtitleProps {
  text: string;
}
const Subtitle = ({ text }: SubtitleProps) => {
  return <h2 className={styles.text}>{text}</h2>;
};

export default Subtitle;
