import styles from "./styles.module.scss";
import AddInfoForm from "./AddInfoForm";
import Palette from "./Palette";
import DragAndDrop from "@/components/DragAndDrop";
import { UserBusiness } from "@/typescript/interfaces/business.interface";

interface SecondaryFormProps {
  logo: File | null;
  setLogo: (value: React.SetStateAction<File | null>) => void;
  errorLogo: boolean;
  banner: File | null;
  setBanner: (value: React.SetStateAction<File | null>) => void;
  formData: UserBusiness;
  setFormData: React.Dispatch<React.SetStateAction<UserBusiness>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SecondaryForm = ({
  logo,
  setLogo,
  errorLogo,
  banner,
  setBanner,
  formData,
  setFormData,
  onChange,
}: SecondaryFormProps) => {
  return (
    <div className={styles.secondary_form}>
      <div className={styles.drag_container}>
        <div className={styles.logo}>
          <h6>Logo</h6>
          <DragAndDrop file={logo} setFile={setLogo} img='Logo' />
          {errorLogo && <span className={styles.error}>El logo es requerido</span>}
        </div>
        <div className={styles.banner}>
          <h6>Banner</h6>
          <DragAndDrop file={banner} setFile={setBanner} img='Banner' />
        </div>
      </div>
      <section className={styles.second_row}>
        <Palette palette={formData.client.palette} setFormData={setFormData} logo={logo} />
        <AddInfoForm formData={formData} onChange={onChange} />
      </section>
    </div>
  );
};

export default SecondaryForm;
