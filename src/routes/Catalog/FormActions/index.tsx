import { FormEvent, SetStateAction, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import Input from "@/components/Input";
import CheckBox from "@/components/Checkbox";
import DragAndDrop from "@/components/DragAndDrop";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { post, remove, update } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { useAppSelector } from "@/store/hooks";
import PopupConfirm from "@/components/PopupConfirm";

interface FormActionsProps {
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  fetchDatasets: () => void;
  action: "post" | "put";
  id?: string;
  name?: string;
  description?: string;
  image?: string;
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

const FormActions = ({
  setShowConfirmation,
  fetchDatasets,
  action,
  id,
  name,
  description,
  image,
}: FormActionsProps) => {
  const [formData, setFormData] = useState(initialValues);
  const [popupDelete, setPopupDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkValidation, setCheckValidation] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const schema = useAppSelector(state => state.dataschema);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  const fieldsToValidate = ["category_name"];
  const errors = useFormValidator(formData, fieldsToValidate, file);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckValidation(true);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const postDataschema = {
          name: formData.category_name,
          description: formData.category_description,
          dataschema: schema[0]._id,
          order: 0,
          image: null,
        };

        // UPLOAD FILE
        if (file) {
          const uploadedImageUrl = await handleFileUpload(file);
          if (uploadedImageUrl) {
            postDataschema.image = uploadedImageUrl;
          } else {
            throw new Error("File upload failed");
          }
        }

        let response;
        if (action === "post") {
          const response = await post("datasets", postDataschema, ENV.BOX);
          if (response.data.statusCode === 201) {
            notify(dict("toast.post_dataset"));
          } else {
            notifyError(dict("toast.error_dataset"));
          }
        } else if (action === "put" && id) {
          if (file) {
            const uploadedImageUrl = await handleFileUpload(file);
            if (uploadedImageUrl) {
              postDataschema.image = uploadedImageUrl;
            } else {
              throw new Error("File upload failed");
            }
          }
          const updatedDataset = {
            name: formData.category_name,
            order: 0,
            description: formData.category_description,
            image: postDataschema.image || formData.category_image,
            visibility: visibility,
          };

          response = await update("datasets", updatedDataset, id, ENV.BOX);
          if (response.statusCode === 200) {
            notify(dict("toast.success_edit"));
          } else {
            notifyError(dict("toast.error_edit"));
          }
        }
      } catch (error) {
        notifyError(dict("toast.error_dataset"));
      } finally {
        setLoading(false);
        setShowConfirmation(false);
        fetchDatasets();
      }
    } else {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setLoading(true);
    remove("datasets", id || "", ENV.BOX)
      .then(() => {
        notify(dict("toast.success_delete"));
        fetchDatasets();
        setShowConfirmation(false);
      })
      .catch(() => {
        notifyError(dict("toast.error_delete"));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (action === "put") {
      setFormData({
        category_name: name || "",
        category_description: description || "",
        category_image: image as unknown as File | null,
      });
      setFile(null);
    }
  }, [action, name, description, image]);

  useEffect(() => {
    if (checkValidation && Object.keys(errors).length === 0) {
      setCheckValidation(false);
    }
  }, [errors]);

  return (
    <form className={styles.form_container} onSubmit={handleSubmit}>
      <div className={styles.inner_container}>
        <p className={styles.title}>Catalog's Information</p>
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
            <DragAndDrop file={file || formData.category_image} setFile={setFile} img='Logo' />
          </div>
        </div>
        <div className={action === "put" ? styles.button_container : styles.button}>
          {action === "put" && (
            <Button
              title='Delete catalog'
              icon={<Icon name='delete' width={20} height={20} strokeColor='#ff0000' viewBox='0 0 23 26' />}
              styleName='btn_delete'
              onclick={() => setPopupDelete(true)}
              loading={!popupDelete && loading}
            />
          )}
          <Button title='Save catalog' type='submit' loading={!popupDelete && loading} />
        </div>
        {popupDelete && (
          <PopupConfirm
            onConfirm={handleDelete}
            onCancel={() => setPopupDelete(false)}
            setShowConfirmation={setPopupDelete}
            title={dict("popup.delete")}
            loading={loading}
            textCancel={dict("popup.cancel")}
            textAccept={dict("popup.confirm")}
          />
        )}
      </div>
    </form>
  );
};

export default FormActions;
