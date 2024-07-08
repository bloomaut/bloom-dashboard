import { FormEvent, SetStateAction, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import Input from "@/components/Input";
import CheckBox from "@/components/Checkbox";
import DragAndDrop from "@/components/DragAndDrop";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { post } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import { DataschemaProps } from "@/typescript/interfaces/catalog.interface";
import { useAppSelector } from "@/store/hooks";

interface PopupCreateProps {
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  title?: string;
  fetchDatasets: () => void;
}

interface InitialValuesProps {
  category_name: string;
  category_description: string;
  category_image: File | null;
}
const initialValues: InitialValuesProps = {
  category_name: "",
  category_description: "",
  category_image: null,
};

const PopupCreate = ({ setShowConfirmation, title, fetchDatasets }: PopupCreateProps) => {
  const [formData, setFormData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [checkValidation, setCheckValidation] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const schema = useAppSelector(state => state.dataschema);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  const fieldsToValidate = ["category_name"];
  const errors = useFormValidator(formData, fieldsToValidate, file);

  const imageUrl = formData.category_image ? formData.category_image : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisibility(e.target.checked);
  };

  const ErrorMessage = ({ error }: { error: string | undefined }) => (
    <p className={error ? styles.error : styles.error_hidden}>{error}</p>
  );

  useEffect(() => {
    if (checkValidation && Object.keys(errors).length === 0) {
      setCheckValidation(false);
    }
  }, [errors]);

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckValidation(true);
    setLoading(true);

    // Wait for the validation to complete
    if (Object.keys(errors).length === 0) {
      try {
        const postDataschema = {
          name: formData.category_name,
          dataschema: schema[0]._id,
          order: 0,
          visibility: visibility,
        };

        const response = await post("datasets", postDataschema, ENV.BOX);
        if (response.data.statusCode === 201) {
          notify(dict("toast.post_dataset"));
        } else {
          notifyError(dict("toast.error_dataset"));
        }
      } catch (error) {
        notifyError(dict("toast.error_dataset"));
      } finally {
        setLoading(false);
        setShowConfirmation(false);
      }
    } else {
      setLoading(false);
    }
  };

  console.log(formData);

  return (
    <form className={styles.form_container} onSubmit={submitPost}>
      <div className={styles.inner_container}>
        <p className={styles.title}>{title}</p>
        <div className={styles.btn_close}>
          <button onClick={() => setShowConfirmation(false)}>
            <Icon name='close' width={30} height={30} strokeColor='#7f7f7f' />
          </button>
        </div>
        <div className={styles.inputs_container}>
          <div className={styles.products_information}>
            <Input
              type='text'
              textLabel='Category name'
              textHolder=''
              name='category_name'
              value={formData.category_name}
              handleChange={handleChange}
            />
            {checkValidation && <ErrorMessage error={errors.category_name} />}
            <Input
              type='textarea'
              textLabel='Description'
              textHolder=''
              name='category_description'
              value={formData.category_description}
              handleChange={handleChange}
            />
            <CheckBox text='Visibile on my apps' active={visibility} onChange={handleVisibility} />
          </div>
          <div className={styles.media}>
            <label className={styles.label}>Photo product</label>
            <DragAndDrop file={file || imageUrl} setFile={setFile} img='Logo' />
          </div>
        </div>
        <div className={styles.button_container}>
          <Button
            title='Delete catalog'
            icon={<Icon name='delete' width={20} height={20} strokeColor='#ff0000' viewBox='0 0 23 26' />}
            styleName='btn_delete'
            type='submit'
            loading={loading}
          />
          <Button title='Save catalog' type='submit' loading={loading} />
        </div>
      </div>
    </form>
  );
};

export default PopupCreate;
