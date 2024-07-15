import styles from "./styles.module.scss";
import DragDrop from "./DragDrop";
import AddInfoForm from "./AddInfoForm";
import Pallette from "./Pallette";

interface SecondaryFormProps {
  logo: string | null;
  banner: string | null;
  palette: [] | null;
  website: string | null;
  instagram: string | null;
  phone: string | null;
}

const SecondaryForm = ({ logo, banner, palette, website, instagram, phone }: SecondaryFormProps) => {
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
