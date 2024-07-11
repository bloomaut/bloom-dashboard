import styles from "./styles.module.scss";
import MainForm from "./MainForm";
import SecondaryForm from "./SecondaryForm";
import Loading from "@/app/[locale]/(no layout)/policy/loading";
import Header from "@/components/Header";
import { useBusinessContext } from "@/context/BusinessContext";
import { useTranslations } from "next-intl";

const MainBusiness = () => {
  const { loading } = useBusinessContext();
  const dict = useTranslations("dict.business.form");

  return (
    <section className={styles.container_business}>
      <Header title={dict("title")} subtitle={dict("subtitle")} />
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
