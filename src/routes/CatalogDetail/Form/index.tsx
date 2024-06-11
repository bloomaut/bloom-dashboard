import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import { SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { post, postFile, update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { DataItemsList, Field, PostDataItem, PutDataItem } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useCatalogDetailContext } from "@/context/CatalogDetailContext";
// Components
import PopupChildren from "@/components/PopupChildren";
import Input from "@/components/Input";
import DragAndDrop from "@/components/DragAndDrop";
import Image from "next/image";

interface Form {
  setShowPopup: (value: SetStateAction<boolean>) => void;
  title: string;
  action: "post" | "put";
  initialValues?: DataItemsList;
  id?: string;
}

const Form = ({ setShowPopup, title, action, initialValues, id }: Form) => {
  const { datasetDetail, fetchDatasetById } = useCatalogDetailContext();
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [checkValidation, setCheckValidation] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const dict = useTranslations("dict");
  const { notify, notifyError } = useMessageToast();

  useEffect(() => {
    if (action === "put" && id) {
      const product = datasetDetail?.dataItems.find(item => item._id === id);
      if (product) {
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

  let dataToSend = {
    dataset: datasetDetail?.dataSet._id ?? "",
    data: formData,
    order: 0,
  };

  const handleFileUpload = async () => {
    if (file) {
      const response = await postFile("small-files/media", file);
      if (response.data.statusCode === 201) {
        const logoUrl = response.data.result.media.url;
        return {
          dataset: datasetDetail?.dataSet._id ?? "",
          data: {
            ...formData,
            listimage: logoUrl,
          },
          order: 0,
        };
      } else {
        notifyError(dict("toast.error_uploading"));
        return null;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setCheckValidation(true);
    if (Object.keys(errors).length === 0) {
      try {
        if (action === "post") {
          const data = await handleFileUpload();
          if (data) {
            dataToSend = data;
          }
          await postDataItem(dataToSend);
        } else if (action === "put" && id) {
          const updatedData = await handleFileUpload();
          if (updatedData) {
            dataToSend = updatedData;
          }
          const data = {
            data: dataToSend.data,
            order: 0,
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

  const ErrorMessage = ({ error }: { error: string | undefined }) => (
    <p className={error ? styles.error : styles.error_hidden}>{error}</p>
  );

  useEffect(() => {
    if (checkValidation && Object.keys(errors).length === 0) {
      setCheckValidation(false);
    }
  }, [errors]);

  return (
    <PopupChildren
      title={dict("popup.create_product")}
      loading={loading}
      onConfirm={handleSubmit}
      onCancel={() => setShowPopup(false)}
      setShowConfirmation={setShowPopup}
      textCancel={dict("popup.cancel")}
      textAccept={action === "post" ? dict("popup.create") : dict("popup.edit")}
    >
      {datasetDetail?.dataSet.dataschema.fields.map(
        (field: Field) =>
          // Si el campo es de tipo text se renderiza el input
          !field.name.includes("image") && (
            <div key={field._id} className={styles.form_control}>
              <Input
                type={field.type === "number" ? "number" : "text"}
                textHolder={field.description}
                name={field.name}
                value={formData ? formData[field.name as keyof DataItemsList] : ""}
                handleChange={handleChange}
              />
              {checkValidation && <ErrorMessage error={errors[field.name as keyof DataItemsList]} />}
            </div>
          ),
      )}
      {action === "post" ? (
        <div className={styles.form_control}>
          <DragAndDrop file={file} setFile={setFile} />
          {checkValidation && <ErrorMessage error={errors.listimage} />}
        </div>
      ) : (
        <>
          {edit && (
            <div className={styles.form_control}>
              <DragAndDrop file={file} setFile={setFile} />
              {checkValidation && <ErrorMessage error={errors.listimage} />}
            </div>
          )}
          {!edit && (
            <div className={styles.image_container}>
              <Image src={formData?.listimage} width={100} height={100} alt='Product Image' />
              <p className={styles.edit} onClick={() => setEdit(true)}>
                {dict("drag.edit_image")}
              </p>
            </div>
          )}
        </>
      )}
    </PopupChildren>
  );
};

export default Form;
