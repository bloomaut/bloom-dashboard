import styles from "./styles.module.scss";
import PowerApp from "./PowerApp";

const Designs = () => {
  return (
    <section className={styles.design_container}>
      <p>Banner azul</p>
      <p>Lista de filtros y caruseles</p>
      <PowerApp />
    </section>
  );
};

export default Designs;
