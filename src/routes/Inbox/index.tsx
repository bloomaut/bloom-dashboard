import styles from "./styles.module.scss";

const InboxPage = () => {
  return (
    <section className={styles.container}>
      <iframe src={process.env.NEXT_PUBLIC_INBOX_URL} title='Inbox App' width='100%' height='100%'></iframe>
    </section>
  );
};

export default InboxPage;
