import styles from "./styles.module.scss";
import { ClientsProvider } from "@/context/ClientsContext";
import { useTranslations } from "next-intl";
import { FlakesProvider } from "@/context/FlakesContext";
// Components
import Title from "@/components/Title";
import Select from "./Select";
import Form from "./Form";
import ListHotlinks from "./ListHotlinks";

const HotlinksPage = () => {
  const dict = useTranslations("dict.hotlinks");

  return (
    <FlakesProvider>
      <ClientsProvider>
        <section className={styles.container}>
          <Title text={dict("title")} />
          <div className={styles.inner_container}>
            <Select />
            <Form />
          </div>
          <ListHotlinks />
        </section>
      </ClientsProvider>
    </FlakesProvider>
  );
};

export default HotlinksPage;
