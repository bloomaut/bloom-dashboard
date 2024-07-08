import styles from "./styles.module.scss";
import Header from "./Header";
import MainForm from "./MainForm";
import SecondaryForm from "./SecondaryForm";
import { useBusinessContext } from "@/context/BusinessContext";
import Loading from "@/app/[locale]/(no layout)/policy/loading";

const MainBusiness = () => {
  const { loading } = useBusinessContext();

  return (
    <section className={styles.container_business}>
      <Header />
      <div className={styles.container_columns}>
        {loading ? (
          <div className={styles.loading}>
            <Loading />
          </div>
        ) : (
          <>
            <MainForm />
            <SecondaryForm />
          </>
        )}
      </div>
    </section>
  );
};

export default MainBusiness;
