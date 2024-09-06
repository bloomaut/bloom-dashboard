import { DesignProvider } from "@/context/DesignContext";
import Header from "./Header";
import TemplateList from "./TemplateList";
import styles from "./styles.module.scss";

const Designs = () => {
  return (
    <DesignProvider>
      <div className={styles.design_container} id='design_container'>
        <header className={styles.header}>
          <Header />
        </header>
        <TemplateList />
      </div>
    </DesignProvider>
  );
};

export default Designs;
