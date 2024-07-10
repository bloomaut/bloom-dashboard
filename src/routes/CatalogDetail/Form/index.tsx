import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import { SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { post, update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { PostDataItem, PutDataItem } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useCatalogDetailContext } from "@/context/CatalogDetailContext";
import { handleFileUpload } from "@/utils/handleFileUpload";
// Components
import Input from "@/components/Input";
import DragAndDrop from "@/components/DragAndDrop";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import Button from "@/components/Button";
import CheckBox from "../../../components/Checkbox";
import Icon from "@/components/Icon";

interface Form {
  setShowPopup: (value: SetStateAction<boolean>) => void;
  title: string;
  action: "post" | "put";
  id?: string;
}

interface InitialValuesProps {
  listname: string;
  listdescription: string;
  listprice: number | null;
  listimage: File | null;
}

const headers = [
  { id: 1, name: "Product's information" },
  { id: 2, name: "Price" },
  { id: 3, name: "Media" },
];

const initialValues: InitialValuesProps = {
  listname: "",
  listdescription: "",
  listprice: null,
  listimage: null,
};

const Form = ({ setShowPopup, action, id }: Form) => {
  const { datasetDetail, fetchDatasetById } = useCatalogDetailContext();
  const [formData, setFormData] = useState(initialValues);
  const [checkValidation, setCheckValidation] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [closing, setClosing] = useState(false);
  const dict = useTranslations("dict");
  const { dropdownRef } = useCloseDropdown(setShowPopup);
  const { notify, notifyError } = useMessageToast();

  const imageUrl = action === "put" && formData.listimage ? formData.listimage : null;

  useEffect(() => {
    if (action === "put" && id) {
      const product = datasetDetail?.dataItems.find((item: any) => item._id === id);
      if (product) {
        setVisibility(product.visibility);
        setFormData(product.data);
      }
    } else {
      setFormData(initialValues);
    }
  }, [action, id, datasetDetail, initialValues]);

  // Validación de campos
  const fieldsToValidate =
    datasetDetail?.dataSet.dataschema.fields.filter((field: any) => field.required).map((field: any) => field.name) ||
    [];
  const errors = useFormValidator(formData, fieldsToValidate, file);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckValidation(true);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const dataToSend = {
          dataset: datasetDetail?.dataSet._id ?? "",
          data: formData,
          order: 0,
          visibility: visibility,
        };

        // UPLOAD IMAGE
        if (file) {
          const uploadedImageUrl = await handleFileUpload(file);
          if (uploadedImageUrl) {
            dataToSend.data.listimage = uploadedImageUrl;
          } else {
            throw new Error("File upload failed");
          }
        }

        // METHOD VERIFICATION
        if (action === "post") {
          await postDataItem(dataToSend);
        } else if (action === "put" && id) {
          const data = {
            data: dataToSend.data,
            order: 0,
            visibility: visibility,
          };
          await putDataItem(data, id);
        }

        setFormData(initialValues);
        setFile(null);
        setCheckValidation(false);
      } catch (error) {
        notifyError(dict("toast.error_item"));
        console.error("Error updating dataset:", error);
      }
    }
  };

  const postDataItem = async (formData: PostDataItem) => {
    setLoading(true);
    const data = await post("dataitem", formData, ENV.BOX);
    if (data.data.statusCode === 201) {
      setLoading(false);
      notify(dict("toast.success_item"));
      setShowPopup(false);
      fetchDatasetById();
    } else {
      notifyError(dict("toast.error_file"));
    }
  };

  const putDataItem = async (formData: PutDataItem, id: string) => {
    setLoading(true);
    const data = await update("dataitem", formData, id, ENV.BOX);
    if (data.statusCode === 200) {
      notify(dict("toast.success_edit"));
      setLoading(false);
      setShowPopup(false);
      fetchDatasetById();
    } else {
      notifyError(dict("toast.error_edit"));
    }
  };

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

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 300);
  };

  useEffect(() => {
    if (checkValidation && Object.keys(errors).length === 0) {
      setCheckValidation(false);
    }
  }, [errors]);

  return (
    <form className={`${styles.form_container} ${closing && styles.closing}`} onSubmit={handleSubmit}>
      <div className={styles.inner_container} ref={dropdownRef}>
        <div className={styles.btn_close}>
          <button onClick={handleClose} type='button'>
            <Icon name='close' width={30} height={30} strokeColor='#7f7f7f' />
          </button>
        </div>
        <header className={styles.header}>
          {headers.map(h => (
            <p key={h.id}>{h.name}</p>
          ))}
        </header>
        <div className={styles.inputs_container}>
          <div className={styles.products_information}>
            <Input
              type='text'
              textLabel='Product name'
              textHolder=''
              name='listname'
              value={formData.listname}
              handleChange={handleChange}
            />
            {checkValidation && <ErrorMessage error={errors.listname} />}
            <Input
              type='textarea'
              textLabel='Description'
              textHolder=''
              name='listdescription'
              value={formData.listdescription}
              handleChange={handleChange}
            />
            <CheckBox text='Visibile on my apps' active={visibility} onChange={handleVisibility} />
          </div>
          <div className={styles.price}>
            <Input
              type='number'
              textLabel='Price'
              textHolder=''
              name='listprice'
              value={formData.listprice || ""}
              handleChange={handleChange}
              inputPrice
            />
            {checkValidation && <ErrorMessage error={errors.listprice} />}
          </div>
          <div className={styles.media}>
            <label className={styles.label}>Photo product</label>
            <DragAndDrop file={file || imageUrl} setFile={setFile} img='Logo' />
          </div>
        </div>
        <div className={styles.button_container}>
          <Button title='Save product' type='submit' loading={loading} />
        </div>
      </div>
    </form>
  );
};

export default Form;
