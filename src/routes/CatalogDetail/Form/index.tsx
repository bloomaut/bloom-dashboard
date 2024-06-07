import PopupChildren from "@/components/PopupChildren";
import Input from "@/components/Input";
import DragAndDrop from "@/components/DragAndDrop";
import styles from "./styles.module.scss";
import { SetStateAction } from "react";
import { useTranslations } from "next-intl";

interface Form {
  onConfirm: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  checkValidation: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  formData: {
    listname: string;
    listdescr: string;
    listprice: number;
    listimage: string;
  };
  errors: {
    listname?: string;
    listdescr?: string;
    listprice?: string;
    listimage?: string;
  };
  file: File | null;
  setFile: (file: SetStateAction<File | null>) => void;
}

const Form = ({ onConfirm, setShowConfirmation, checkValidation, onChange, formData, errors, file, setFile }: Form) => {
  const dict = useTranslations("dict");

  return (
    <PopupChildren
      validation
      title={dict("popup.create_product")}
      onConfirm={onConfirm}
      onCancel={() => setShowConfirmation(false)}
      setShowConfirmation={setShowConfirmation}
      textCancel={dict("popup.cancel")}
      textAccept={dict("popup.create")}
    >
      <div className={styles.form_control}>
        <Input type='text' textHolder={"Name"} name='listname' value={formData.listname} handleChange={onChange} />
        {checkValidation && <p className={errors.listname ? styles.error : styles.error_hidden}>{errors.listname}</p>}
      </div>
      <div className={styles.form_control}>
        <Input
          type='text'
          textHolder={"Descripcion"}
          name='listdescr'
          value={formData.listdescr}
          handleChange={onChange}
        />
        {checkValidation && <p className={errors.listdescr ? styles.error : styles.error_hidden}>{errors.listdescr}</p>}
      </div>
      <div className={styles.form_control}>
        <Input
          type='number'
          textHolder={"Precio"}
          name='listprice'
          value={formData.listprice === 0 ? "" : formData.listprice}
          handleChange={onChange}
        />
        {checkValidation && <p className={errors.listprice ? styles.error : styles.error_hidden}>{errors.listprice}</p>}
      </div>
      <div className={styles.form_control}>
        <DragAndDrop file={file} setFile={setFile} />
        {checkValidation && <p className={errors.listimage ? styles.error : styles.error_hidden}>{errors.listimage}</p>}
      </div>
    </PopupChildren>
  );
};

export default Form;
