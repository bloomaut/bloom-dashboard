import styles from "./styles.module.scss";
import { ClientsProvider } from "@/context/ClientsContext";
import { useTranslations } from "next-intl";
import { FlakesProvider, useFlakesContext } from "@/context/FlakesContext";
//Componentes
import Title from "@/components/Title";
import Select from "./Select";
import Form from "./Form";
import ListHotlinks from "./ListHotlinks";

const HotlinksPage = () => {
  const dict = useTranslations("dict.hotlinks");
  const { flakes } = useFlakesContext();

  return (
    <FlakesProvider>
      <ClientsProvider>
        <section className={styles.container}>
          <Title text={dict("title")} />
          <div className={styles.inner_container}>
            <Select />
            {flakes && flakes.length > 0 ? <Form /> : null}
          </div>
          <ListHotlinks />
        </section>
      </ClientsProvider>
    </FlakesProvider>
  );
};

export default HotlinksPage;
