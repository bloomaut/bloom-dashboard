import Header from "./Header";
import PowerApp from "./PowerApp";
import styles from "./styles.module.scss";

const Designs = () => {
  return (
    <div className={styles.design_container} id='design_container'>
      <header className={styles.header}>
        <Header />
      </header>
      <PowerApp />
    </div>
  );
};

export default Designs;
