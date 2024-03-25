import Title from "@/components/Title";
import styles from "./styles.module.scss";

const InboxPage = () => {
  return (
    <section className={styles.container}>
      <Title text='Bandeja de Entrada' />
      <iframe src='https://notimation.com/es/agents' title='Agents App' width='950' height='550'></iframe>
    </section>
  );
};

export default InboxPage;
