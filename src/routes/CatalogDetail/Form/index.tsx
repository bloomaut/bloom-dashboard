import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import { SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { post, update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import {
  DataItemsType,
  DataschemaField,
  DataschemaProps,
  DataschemaPropsArray,
  PostDataItem,
  PutDataItem,
} from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useCatalogDetailContext } from "@/context/CatalogDetailContext";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { AllProducts } from "@/typescript/interfaces/catalog.interface";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
// Components
import Input from "@/components/Input";
import DragAndDrop from "@/components/DragAndDrop";
import Button from "@/components/Button";
import CheckBox from "../../../components/Checkbox";
import Icon from "@/components/Icon";

// Interfaces
interface FormProps {
  setShowPopup: (value: SetStateAction<boolean>) => void;
  title: string;
  action: "post" | "put";
  id?: string;
  allProducts?: AllProducts[];
  onUpdate?: (editedProduct: AllProducts) => void;
  onCreate?: (newItem: AllProducts) => void;
}

interface InitialValuesProps {
  data: {
    listname: string;
    listdescr: string;
    listprice: number | null;
    listimage: File | null;
  };
  order: number | null;
  visibility: boolean;
}

const headers = [
  { id: 1, name: "Product's information" },
  { id: 2, name: "Price" },
  { id: 3, name: "Media" },
];

const initialValues: InitialValuesProps = {
  data: {
    listname: "",
    listdescr: "",
    listprice: null,
    listimage: null,
  },
  order: null,
  visibility: true,
};

const Form = ({ setShowPopup, action, id, allProducts, onUpdate, onCreate }: FormProps) => {
  const { datasetDetail } = useCatalogDetailContext();
  const [formData, setFormData] = useState<InitialValuesProps>(initialValues);
  const [checkValidation, setCheckValidation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [closing, setClosing] = useState<boolean>(false);
  const { dropdownRef } = useCloseDropdown(setShowPopup);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  const imageUrl = action === "put" && formData.data?.listimage ? formData.data?.listimage : null;

  useEffect(() => {
    if (action === "put" && id) {
      const product = datasetDetail?.dataItems.find((item: DataItemsType) => item._id === id);
      if (product) {
        setFormData({
          data: {
            listname: product.data.listname,
            listdescr: product.data.listdescr,
            listprice: product.data.listprice ? parseFloat(product.data.listprice) : null,
            listimage: product.data.listimage ? new File([], product.data.listimage) : null,
          },
          order: product.order,
          visibility: product.visibility,
        });
      } else if (allProducts) {
        const product = allProducts.find((item: AllProducts) => item._id === id);
        if (product) {
          setFormData({
            data: {
              listname: product.data.listname,
              listdescr: product.data.listdescr,
              listprice: product.data.listprice,
              listimage: product.data.listimage,
            },
            order: product.order,
            visibility: product.visibility,
          });
        }
      }
    } else {
      setFormData(initialValues);
    }
  }, [action, id, datasetDetail, allProducts]);

  const fieldsToValidate: string[] = [];

  if (Array.isArray(datasetDetail?.dataSet.dataschema)) {
    // Caso cuando dataschema es un arreglo de DataschemaPropsArray
    datasetDetail?.dataSet.dataschema.forEach((schema: DataschemaPropsArray) => {
      schema.fields.forEach((field: DataschemaField) => {
        if (field.required) {
          fieldsToValidate.push(field.name);
        }
      });
    });
  } else if (datasetDetail?.dataSet.dataschema) {
    // Caso cuando dataschema es un objeto DataschemaProps
    (datasetDetail.dataSet.dataschema as DataschemaProps).fields.forEach((field: DataschemaField) => {
      if (field.required) {
        fieldsToValidate.push(field.name);
      }
    });
  }

  const errors = useFormValidator(formData, fieldsToValidate, file);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckValidation(true);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const dataToSend = {
          dataset: datasetDetail?.dataSet._id ?? "",
          data: formData.data,
          order: formData.order,
          visibility: formData.visibility,
        };

        if (file) {
          const uploadedImageUrl = await handleFileUpload(file);
          if (uploadedImageUrl) {
            dataToSend.data.listimage = uploadedImageUrl;
          } else {
            throw new Error(dict("toast.error_uploading"));
          }
        }

        if (action === "post") {
          await postDataItem(dataToSend);
        } else if (action === "put" && id) {
          const data = {
            data: dataToSend.data,
            order: dataToSend.order,
            visibility: dataToSend.visibility,
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
      if (onCreate) {
        onCreate(data.data.data);
      }
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
      if (onUpdate) {
        onUpdate(data.data);
      }
    } else {
      notifyError(dict("toast.error_edit"));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in formData.data) {
      setFormData((prevState: InitialValuesProps) => ({
        ...prevState,
        data: {
          ...prevState.data,
          [name]: value,
        },
      }));
    } else if (name === "order") {
      setFormData((prevState: InitialValuesProps) => ({
        ...prevState,
        order: Number(value) || null,
      }));
    }
  };

  const handleVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isVisible = e.target.checked;
    setFormData((prevState: InitialValuesProps) => ({
      ...prevState,
      visibility: isVisible,
    }));
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
              value={formData.data?.listname || ""}
              handleChange={handleChange}
            />
            {checkValidation && <ErrorMessage error={errors.listname} />}
            <Input
              type='textarea'
              textLabel='Description'
              textHolder=''
              name='listdescr'
              value={formData.data?.listdescr || ""}
              handleChange={handleChange}
            />
            <Input
              type='text'
              textLabel='Order number'
              textHolder=''
              textDescription={dict("catalog.form_actions.order_description")}
              name='order'
              value={formData.order || 0}
              handleChange={handleChange}
            />
            <CheckBox text='Visible on my apps' active={formData.visibility} onChange={handleVisibility} />
          </div>
          <div className={styles.price}>
            <Input
              type='number'
              textLabel='Price'
              textHolder=''
              name='listprice'
              value={formData.data?.listprice ?? ""}
              handleChange={handleChange}
              inputPrice
            />
            {checkValidation && <ErrorMessage error={errors.listprice} />}
          </div>
          <div className={styles.media}>
            <label className={styles.label}>{dict("catalog.form_actions.image")}</label>
            <DragAndDrop file={file || imageUrl} setFile={setFile} />
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
