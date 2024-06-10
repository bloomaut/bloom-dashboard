import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import { SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { post, postFile } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { DataItemsList, Field, PostDataItem } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useCatalogDetailContext } from "@/context/CatalogDetailContext";
// Components
import PopupChildren from "@/components/PopupChildren";
import Input from "@/components/Input";
import DragAndDrop from "@/components/DragAndDrop";

interface Form {
  setShowPopupCreate: (value: SetStateAction<boolean>) => void;
}

const Form = ({ setShowPopupCreate }: Form) => {
  const { datasetDetail, fetchDatasetById } = useCatalogDetailContext();
  const [initialFormData, setInitialFormData] = useState<DataItemsList | undefined>();
  const [formData, setFormData] = useState<DataItemsList | undefined>(initialFormData);
  const [checkValidation, setCheckValidation] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const dict = useTranslations("dict");
  const { notify, notifyError } = useMessageToast();

  // Crea los campos para el formulario vacíos
  useEffect(() => {
    const listEmptyForm: any = {};

    datasetDetail?.dataSet.dataschema.fields.forEach(field => {
      listEmptyForm[field.name] = "";
    });

    setInitialFormData(listEmptyForm);
    setFormData(listEmptyForm);
  }, []);

  // Validación de campos
  const fieldsToValidate =
    datasetDetail?.dataSet.dataschema.fields.filter((field: any) => field.required).map((field: any) => field.name) ||
    [];
  const errors = useFormValidator(formData, fieldsToValidate, file);

  // Crea el form y lo postea
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckValidation(true);
    if (Object.keys(errors).length === 0) {
      try {
        let dataToSend = {
          dataset: datasetDetail?.dataSet._id ?? "",
          data: formData,
          order: 0,
        };

        if (file) {
          const response = await postFile("small-files/media", file);
          if (response.data.statusCode === 201) {
            const logoUrl = response.data.result.media.url;
            dataToSend = {
              dataset: datasetDetail?.dataSet._id ?? "",
              data: {
                ...formData,
                listimage: logoUrl,
              },
              order: 0,
            };
          }
        }
        await postDataItem(dataToSend);
        notify(dict("toast.success_item"));
        setShowPopupCreate(false);
        setFormData(initialFormData);
        setFile(null);
        setCheckValidation(false);
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
      onConfirm={handleCreate}
      onCancel={() => setShowPopupCreate(false)}
      setShowConfirmation={setShowPopupCreate}
      textCancel={dict("popup.cancel")}
      textAccept={dict("popup.create")}
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
      {datasetDetail?.dataSet.dataschema.fields.map((field: Field) => {
        // Si el campo es de tipo imagen se renderiza el drag and drop
        if (field.name.includes("image")) {
          return (
            <div key={field._id} className={styles.form_control}>
              <DragAndDrop file={file} setFile={setFile} />
              {checkValidation && <ErrorMessage error={errors.listimage} />}
            </div>
          );
        }
        return null;
      })}
    </PopupChildren>
  );
};

export default Form;
