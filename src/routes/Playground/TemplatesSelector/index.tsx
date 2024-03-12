import styles from "./styles.module.scss";

const TemplatesSelector = () => {
  return (
    <div className={styles.container}>
      <div className={styles.template_container}>
        <h4 className={styles.title}>Título del Skin</h4>
        <div className={styles.template}>
          <div className={styles.sm_card}></div>
          <div className={styles.lg_card}></div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesSelector;
