import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
// Components
import Title from "@/components/Title";
import Select from "./Select";
import Form from "./Form";
import ListHotlinks from "./ListHotlinks";
import { useFlakesContext } from "@/context/FlakesContext";
import LoadingSpinner from "@/components/Loading";

const Hotlinks = () => {
  const dict = useTranslations("dict.hotlinks");
  const { loading } = useFlakesContext();

  return (
    <section className={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Title text={dict("title")} />
          <div className={styles.inner_container}>
            <Select />
            <Form />
          </div>
          <ListHotlinks />
        </>
      )}
    </section>
  );
};

export default Hotlinks;
