import styles from "./styles.module.scss";

interface Props {
  text: string;
}

const SectionTitle = ({ text }: Props) => {
  return <h3 className={styles.section_title}>{text}</h3>;
};

export default SectionTitle;
