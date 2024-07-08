import styles from "./styles.module.scss";

const SideTrack = () => {
  return (
    <section className={styles.sidetrack_container}>
      <div className={styles.title_container}>
        <h2 className={styles.title}>Step 3</h2>
        <p className={styles.description}>SideTrack</p>
      </div>
      <div className={styles.steps_container}>
        <button>Business information</button>
        <button>Select template</button>
        <button>Catalog</button>
        <button>Generate PowerApp</button>
      </div>
    </section>
  );
};

export default SideTrack;
