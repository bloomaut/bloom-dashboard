import styles from "./styles.module.scss";
import Header from "./Header";
import MainForm from "./MainForm";
import SecondaryForm from "./SecondaryForm";
import { BusinessProvider } from "@/context/BusinessContext";

const Business = () => {
  return (
    <BusinessProvider>
      <section className={styles.container_business}>
        <Header />
        <div className={styles.container_columns}>
          <MainForm />
          <SecondaryForm />
        </div>
      </section>
    </BusinessProvider>
  );
};

export default Business;
