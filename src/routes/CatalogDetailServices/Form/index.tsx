import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import { SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { post, update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { DataItemsServiceType } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useCatalogServiceContext } from "@/context/CatalogServicesContext";
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
    listimage: string | null;
  };
  order: number | null;
  visibility: boolean;
}

const headers = [
  { id: 1, name: "Service information" },
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

const Form = ({ setShowPopup, action, id, allProducts, onUpdate }: FormProps) => {
  const { services, handleAddService, handleUpdateService } = useCatalogServiceContext();
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
      const service = services?.dataItems.find((item: DataItemsServiceType) => item._id === id);
      if (service) {
        // setFormData({
        //   data: {
        //     listname: service.data.listname,
        //     listdescr: service.data.listdescr,
        //     listprice: service.data.listprice ? parseFloat(service.data.listprice) : null,
        //     listimage: service.data.listimage,
        //   },
        //   order: service.order,
        //   visibility: service.visibility,
        // });
      } else if (allProducts) {
        const service = allProducts.find((item: AllProducts) => item._id === id);
        if (service) {
          setFormData({
            data: {
              listname: service.data.listname,
              listdescr: service.data.listdescr,
              listprice: service.data.listprice,
              listimage: service.data.listimage,
            },
            order: service.order,
            visibility: service.visibility,
          });
        }
      }
    } else {
      setFormData(initialValues);
    }
  }, [action, id, services, allProducts]);

  //   const fieldsToValidate =
  //     datasetDetail?.dataSet?.dataschema?.fields
  //       .filter((field: DataschemaField) => field.required)
  //       .map((field: DataschemaField) => field.name) || [];

  //   const errors = useFormValidator(formData, fieldsToValidate, file);

  //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     setCheckValidation(true);
  //     if (Object.keys(errors).length === 0) {
  //       setLoading(true);
  //       try {
  //         const dataToSend = {
  //           dataset: datasetDetail?.dataSet._id ?? "",
  //           data: formData.data,
  //           visibility: formData.visibility,
  //           ...(formData.order !== null && { order: formData.order }),
  //         };

  //         if (file) {
  //           const uploadedImageUrl = await handleFileUpload(file);
  //           if (uploadedImageUrl) {
  //             dataToSend.data.listimage = uploadedImageUrl;
  //           } else {
  //             throw new Error(dict("toast.error_uploading"));
  //           }
  //         }

  //         if (action === "post") {
  //           await postDataItem(dataToSend);
  //         } else if (action === "put" && id) {
  //           const data = {
  //             data: dataToSend.data,
  //             order: dataToSend.order,
  //             visibility: dataToSend.visibility,
  //           };
  //           await putDataItem(data, id);
  //         }

  //         setFormData(initialValues);
  //         setFile(null);
  //         setCheckValidation(false);
  //       } catch (error) {
  //         notifyError(dict("toast.error_item"));
  //         console.error("Error updating dataset:", error);
  //       }
  //     }
  //   };

  //   const postDataItem = async (formData: PostDataItem) => {
  //     setLoading(true);
  //     const data = await post("dataitem", formData, ENV.BOX);
  //     if (data.data.statusCode === 201) {
  //       setLoading(false);
  //       handleAddDataset(data.data.data);
  //       notify(dict("toast.success_item"));
  //       setShowPopup(false);
  //     } else {
  //       notifyError(dict("toast.error_file"));
  //     }
  //   };

  //   const putDataItem = async (formData: PutDataItem, id: string) => {
  //     setLoading(true);
  //     const data = await update("dataitem", formData, id, ENV.BOX);
  //     if (data.statusCode === 200) {
  //       setShowPopup(false);
  //       notify(dict("toast.success_edit"));
  //       setLoading(false);
  //       if (onUpdate) {
  //         onUpdate(data.data);
  //       } else {
  //         handleUpdateDataset(data.data);
  //       }
  //     } else {
  //       notifyError(dict("toast.error_edit"));
  //     }
  //   };

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

  //   useEffect(() => {
  //     if (checkValidation && Object.keys(errors).length === 0) {
  //       setCheckValidation(false);
  //     }
  //   }, [errors]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <form className={`${styles.form_container} ${closing && styles.closing}`}>
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
          <div className={styles.column_one}>
            <Input
              type='text'
              textLabel='Service name'
              textHolder=''
              name='listname'
              value={formData.data?.listname || ""}
              handleChange={handleChange}
            />
            {/* {checkValidation && <ErrorMessage error={errors.listname} />} */}
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
              value={formData.order ?? ""}
              handleChange={handleChange}
            />
            <CheckBox text='Visible on my apps' active={formData.visibility} onChange={handleVisibility} />
          </div>
          <div className={styles.column_two}>
            <Input
              type='number'
              textLabel='Price'
              textHolder=''
              name='listprice'
              value={formData.data?.listprice ?? ""}
              handleChange={handleChange}
            />
            {/* {checkValidation && <ErrorMessage error={errors.listprice} />} */}
            <div className={styles.extra_config}>
              <p className={styles.extra_config_title}>Extra Config</p>
              <div className={styles.extra_config_row}>
                <Input
                  type='number'
                  textLabel='Lunch from'
                  textHolder='- am'
                  name='lunchFrom'
                  value={formData.data?.listprice ?? ""}
                  handleChange={handleChange}
                />
                <Input
                  type='number'
                  textLabel='Lunch to'
                  textHolder='- pm'
                  name='lunchTo'
                  value={formData.data?.listprice ?? ""}
                  handleChange={handleChange}
                />
              </div>
              <Input
                type='number'
                textLabel='Service duration'
                textHolder='60'
                name='serviceDuration'
                value={formData.data?.listprice ?? ""}
                handleChange={handleChange}
              />
              <Input
                type='number'
                textLabel='Simultaneous Services'
                textHolder='#'
                name='simultaneousServices'
                value={formData.data?.listprice ?? ""}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.column_three}>
            <label className={styles.label}>{dict("catalog.form_actions.image")}</label>
            <DragAndDrop type='image' file={file} setFile={setFile} currentImage={imageUrl} />
          </div>
        </div>
        <div className={styles.available_days_container}>
          <p className={styles.available_days_title}>Available days for service</p>
          <div className={styles.days_container}>
            {days.map((day, index) => (
              <div className={styles.box}>
                <div className={styles.day_container}>
                  <span key={day} className={styles.day}>
                    {day}
                  </span>
                </div>
                <div className={styles.availability}>
                  <div className={styles.from}>
                    <Input
                      type='number'
                      textLabel='From'
                      textHolder='00:00'
                      name='from'
                      value={formData.data?.listprice ?? ""}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className={styles.to}>
                    <Input
                      type='number'
                      textLabel='To'
                      textHolder='00:00'
                      name='to'
                      value={formData.data?.listprice ?? ""}
                      handleChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.button_container}>
          <Button title='Save service' type='submit' loading={loading} />
        </div>
      </div>
    </form>
  );
};

export default Form;
