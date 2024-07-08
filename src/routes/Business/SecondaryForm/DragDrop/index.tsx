import styles from "./styles.module.scss";
import DragAndDrop from "@/components/DragAndDrop";

const DragDrop = () => {
  const handleFile = () => {
    null;
  };

  return (
    <section className={styles.drag_drop}>
      <div className={styles.logo}>
        <h6>Logo</h6>
        <DragAndDrop setFile={handleFile} img='Logo' />
      </div>
      <div className={styles.banner}>
        <h6>Banner</h6>
        <DragAndDrop setFile={handleFile} img='Banner' />
      </div>
    </section>
  );
};

export default DragDrop;
