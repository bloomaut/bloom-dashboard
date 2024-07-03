import styles from "./styles.module.scss";
import Header from "./Header";
import MainForm from "./MainForm";
import SecondaryForm from "./SecondaryForm";

const Business = () => {
  return (
    <section className={styles.container_business}>
      <Header />
      <div className={styles.container_columns}>
        <MainForm />
        <SecondaryForm />
      </div>
    </section>
  );
};

export default Business;
