import styles from "./styles.module.scss";
import DragAndDrop from "@/components/DragAndDrop";

const DragDrop = () => {
  // eslint-disable-next-line no-empty-function
  const handleFile = () => {};

  return (
    <section className={styles.drag_drop}>
      <div className={styles.logo}>
        <h6>Logo</h6>
        <DragAndDrop setFile={handleFile} />
      </div>
      <div className={styles.banner}>
        <h6>Banner</h6>
        <DragAndDrop setFile={handleFile} />
      </div>
    </section>
  );
};

export default DragDrop;
