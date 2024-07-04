import styles from "./styles.module.scss";
import DragDrop from "./DragDrop";
import AddInfoForm from "./AddInfoForm";
import Pallette from "./Pallette";

const SecondaryForm = () => {
  return (
    <div className={styles.secondary_form}>
      <DragDrop />
      <section className={styles.second_row}>
        <Pallette />
        <AddInfoForm />
      </section>
    </div>
  );
};

export default SecondaryForm;
