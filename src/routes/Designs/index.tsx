import Header from "./Header";
import styles from "./styles.module.scss";

const Designs = () => {
  return (
    <div className={styles.design_container} id='design_container'>
      <header className={styles.header}>
        <Header />
      </header>
      <p>Lista de filtros y caruseles</p>
    </div>
  );
};

export default Designs;
