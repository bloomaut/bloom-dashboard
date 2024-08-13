import { SetStateAction, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import Input from "@/components/Input";
import CheckBox from "@/components/Checkbox";
import DragAndDrop from "@/components/DragAndDrop";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import PopupConfirm from "@/components/PopupConfirm";
import { post, remove, update } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { useAppSelector } from "@/store/hooks";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useCatalogContext } from "@/context/CatalogContext";

interface FormActionsProps {
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  action: "post" | "put";
  id?: string;
  name?: string;
  description?: string;
  visibility?: boolean;
  image?: string;
  dataschema?: string;
}

interface InitialValuesProps {
  type_catalog: string;
  category_name: string;
  category_description: string;
  category_image: File | null;
  category_visibility: boolean;
}
const initialValues: InitialValuesProps = {
  type_catalog: "",
  category_name: "",
  category_description: "",
  category_image: null,
  category_visibility: true,
};

const FormActions = ({
  setShowConfirmation,
  action,
  id,
  name,
  description,
  visibility,
  image,
  dataschema,
}: FormActionsProps) => {
  const [formData, setFormData] = useState(initialValues);
  const [popupDelete, setPopupDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkValidation, setCheckValidation] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [closing, setClosing] = useState(false);
  const { handleRemoveDataset, handleAddDataset, handleUpdateDataset } = useCatalogContext();
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);
  const { notify, notifyError } = useMessageToast();
  const schema = useAppSelector(state => state.dataschema);
  const dict = useTranslations("dict");

  const fieldsToValidate = ["category_name"];
  const errors = useFormValidator(formData, fieldsToValidate, file);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: InitialValuesProps) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prevState => ({
      ...prevState,
      category_visibility: e.target.checked,
    }));
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
          dataschema: formData.type_catalog === "uitool-products" ? schema[0]._id : schema[1]._id,
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
            handleAddDataset(response.data.data);
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
            visibility: formData.category_visibility,
          };

          response = await update("datasets", updatedDataset, id, ENV.BOX);
          if (response.statusCode === 200) {
            handleUpdateDataset(response.data);
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
      }
    } else {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    if (id) {
      const data = await remove("datasets", id, ENV.BOX);
      if (data.statusCode === 200) {
        setShowConfirmation(false);
        notify(dict("toast.success_delete"));
        setLoading(false);
        handleRemoveDataset(id);
      } else {
        notifyError(dict("toast.error_delete"));
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 300);
  };

  useEffect(() => {
    if (action === "put") {
      setFormData({
        type_catalog: dataschema || "",
        category_name: name || "",
        category_description: description || "",
        category_image: image as unknown as File | null,
        category_visibility: visibility ?? true,
      });
      setFile(null);
    }
  }, [action, name, description, image, visibility, dataschema]);

  useEffect(() => {
    if (checkValidation && Object.keys(errors).length === 0) {
      setCheckValidation(false);
    }
  }, [errors]);

  return (
    <form className={`${styles.form_container} ${closing && styles.closing}`} onSubmit={handleSubmit}>
      <div className={styles.inner_container} ref={!popupDelete ? dropdownRef : null}>
        <p className={styles.title}>{dict("catalog.form_actions.title")}</p>
        <div className={styles.btn_close}>
          <button onClick={handleClose} type='button'>
            <Icon name='close' width={30} height={30} strokeColor='#7f7f7f' />
          </button>
        </div>
        <div className={styles.inputs_container}>
          <div className={styles.products_information}>
            <div className={styles.select_type}>
              <label className={styles.label}>{dict("catalog.form_actions.catalog_type")}</label>
              <select
                className={styles.select}
                onChange={handleChange}
                name='type_catalog'
                value={formData.type_catalog}
                disabled={action === "put"}
              >
                <option value='' hidden>
                  {dict("catalog.form_actions.select_type")}
                </option>
                <option value={schema[0].category}>{dict("catalog.form_actions.products")}</option>
                <option value={schema[1].category}>{dict("catalog.form_actions.services")}</option>
              </select>
            </div>
            <Input
              type='text'
              textLabel={dict("catalog.form_actions.name")}
              textHolder=''
              name='category_name'
              value={formData.category_name}
              handleChange={handleChange}
            />
            {checkValidation && <ErrorMessage error={errors.category_name} />}
            <Input
              type='textarea'
              textLabel={dict("catalog.form_actions.description")}
              textHolder=''
              name='category_description'
              value={formData.category_description}
              handleChange={handleChange}
            />
            <CheckBox
              text={dict("catalog.form_actions.visibility")}
              active={formData.category_visibility}
              onChange={handleVisibility}
            />
          </div>
          <div className={styles.media}>
            <label className={styles.label}>{dict("catalog.form_actions.image")}</label>
            <DragAndDrop file={file || formData.category_image} setFile={setFile} />
          </div>
        </div>
        <div className={action === "put" ? styles.button_container : styles.button}>
          {action === "put" && (
            <Button
              title={dict("catalog.form_actions.delete")}
              icon={<Icon name='delete' width={20} height={20} strokeColor='#ff0000' viewBox='0 0 23 26' />}
              styleName='btn_delete'
              onclick={() => setPopupDelete(true)}
            />
          )}
          <Button title={dict("catalog.form_actions.save")} type='submit' loading={!popupDelete && loading} />
        </div>
      </div>
      {popupDelete && id !== "1" && (
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
    </form>
  );
};

export default FormActions;
