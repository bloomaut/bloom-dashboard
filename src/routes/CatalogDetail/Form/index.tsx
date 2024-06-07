import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import { SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { post, postFile } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { DataItemsList, Dataset, PostDataItem } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useCatalogDetailContext } from "@/context/CatalogDetailContext";
// Components
import PopupChildren from "@/components/PopupChildren";
import Input from "@/components/Input";
import DragAndDrop from "@/components/DragAndDrop";

interface Form {
  setShowPopupCreate: (value: SetStateAction<boolean>) => void;
}

const initialFormData = {
  listname: "",
  listdescr: "",
  listprice: 0,
  listimage: "",
};

const Form = ({ setShowPopupCreate }: Form) => {
  const [formData, setFormData] = useState<DataItemsList>(initialFormData);
  const [checkValidation, setCheckValidation] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const dict = useTranslations("dict");
  const fieldsToValidate = ["listname", "listdescr", "listprice", "listimage"];
  const errors = useFormValidator(formData, fieldsToValidate, file);
  const { notify, notifyError } = useMessageToast();
  const { datasetDetail, fetchDatasetById } = useCatalogDetailContext();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckValidation(true);
    if (file) {
      try {
        if (Object.keys(errors).length === 0) {
          const response = await postFile("small-files/media", file);
          if (response.data.statusCode === 201) {
            const logoUrl = response.data.result.media.url;

            const dataToSend = {
              dataset: datasetDetail?.dataSet._id ?? "",
              data: {
                ...formData,
                listimage: logoUrl,
              },
              order: 0,
            };

            await postDataItem(dataToSend);

            notify(dict("toast.success_item"));
            setShowPopupCreate(false);
            setFormData(initialFormData);
            setFile(null);
            setCheckValidation(false);
          }
        }
      } catch (error) {
        notifyError(dict("toast.error_item"));
        console.error("Error updating dataset:", error);
      }
    }
  };

  const postDataItem = async (formData: PostDataItem) => {
    const data = await post("dataitem", formData, ENV.BOX);
    if (data.data.statusCode === 201) {
      fetchDatasetById();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <PopupChildren
      validation
      title={dict("popup.create_product")}
      onConfirm={handleCreate}
      onCancel={() => setShowPopupCreate(false)}
      setShowConfirmation={setShowPopupCreate}
      textCancel={dict("popup.cancel")}
      textAccept={dict("popup.create")}
    >
      <div className={styles.form_control}>
        <Input type='text' textHolder={"Name"} name='listname' value={formData.listname} handleChange={handleChange} />
        {checkValidation && <p className={errors.listname ? styles.error : styles.error_hidden}>{errors.listname}</p>}
      </div>
      <div className={styles.form_control}>
        <Input
          type='text'
          textHolder={"Descripcion"}
          name='listdescr'
          value={formData.listdescr}
          handleChange={handleChange}
        />
        {checkValidation && <p className={errors.listdescr ? styles.error : styles.error_hidden}>{errors.listdescr}</p>}
      </div>
      <div className={styles.form_control}>
        <Input
          type='number'
          textHolder={"Precio"}
          name='listprice'
          value={formData.listprice === 0 ? "" : formData.listprice}
          handleChange={handleChange}
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
