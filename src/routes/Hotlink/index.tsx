import Select from "./Select";
import styles from "./styles.module.scss";
import Title from "@/components/Title";
import { FlakesProvider } from "@/context/FlakesContext";

const HotlinksPage = () => {
  return (
    <FlakesProvider>
      <section className={styles.container}>
        <Title text='Generación Hotlink' />
        <div className={styles.inner_container}>
          <Select />
        </div>
      </section>
    </FlakesProvider>
  );
};

export default HotlinksPage;
