import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import { SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { post, update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import {
  DataItemsServiceType,
  DataschemaField,
  PostDataItem,
  PutDataItem,
} from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";
import { useCatalogServiceContext } from "@/context/CatalogServicesContext";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Components
import Input from "@/components/Input";
import DragAndDrop from "@/components/DragAndDrop";
import Button from "@/components/Button";
import CheckBox from "../../../components/Checkbox";
import Icon from "@/components/Icon";
import DayInput from "./DayInput";
import moment from "moment";

// Interfaces
interface FormProps {
  setShowPopup: (value: SetStateAction<boolean>) => void;
  title: string;
  action: "post" | "put";
  id?: string;
  allServices?: DataItemsServiceType[];
  onUpdate?: (editedProduct: DataItemsServiceType) => void;
}

interface InitialValuesProps {
  data: {
    serviceName: string;
    serviceDescr: string;
    servicePrice: number | null;
    serviceImage: string;
    duration: number | null;
    simultaneous: number | null;
    lunchFrom: string;
    lunchTo: string;
    mondayFrom: string;
    mondayTo: string;
    tuesdayFrom: string;
    tuesdayTo: string;
    wednesdayFrom: string;
    wednesdayTo: string;
    thursdayFrom: string;
    thursdayTo: string;
    fridayFrom: string;
    fridayTo: string;
    saturdayFrom: string;
    saturdayTo: string;
    sundayFrom: string;
    sundayTo: string;
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
    serviceName: "",
    serviceDescr: "",
    servicePrice: null,
    serviceImage: "",
    duration: null,
    simultaneous: null,
    lunchFrom: "",
    lunchTo: "",
    mondayFrom: "",
    mondayTo: "",
    tuesdayFrom: "",
    tuesdayTo: "",
    wednesdayFrom: "",
    wednesdayTo: "",
    thursdayFrom: "",
    thursdayTo: "",
    fridayFrom: "",
    fridayTo: "",
    saturdayFrom: "",
    saturdayTo: "",
    sundayFrom: "",
    sundayTo: "",
  },
  order: null,
  visibility: true,
};

const Form = ({ setShowPopup, action, id, allServices, onUpdate }: FormProps) => {
  const { services, handleAddService, handleUpdateService } = useCatalogServiceContext();
  const [formData, setFormData] = useState<InitialValuesProps>(initialValues);
  const [checkValidation, setCheckValidation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [closing, setClosing] = useState<boolean>(false);
  const { dropdownRef } = useCloseDropdown(setShowPopup);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  const imageUrl = action === "put" && formData.data?.serviceImage ? formData.data?.serviceImage : null;

  useEffect(() => {
    if (action === "put" && id) {
      const service = services?.dataItems.find((item: DataItemsServiceType) => item._id === id);
      if (service) {
        setFormData({
          data: {
            serviceName: service.data.serviceName,
            serviceDescr: service.data.serviceDescr,
            servicePrice: service.data.servicePrice,
            serviceImage: service.data.serviceImage,
            duration: service.data.duration || null,
            simultaneous: service.data.simultaneous || null,
            lunchFrom: service.data.lunchFrom || "",
            lunchTo: service.data.lunchTo || "",
            mondayFrom: service.data.mondayFrom,
            mondayTo: service.data.mondayTo,
            tuesdayFrom: service.data.tuesdayFrom,
            tuesdayTo: service.data.tuesdayTo,
            wednesdayFrom: service.data.wednesdayFrom,
            wednesdayTo: service.data.wednesdayTo,
            thursdayFrom: service.data.thursdayFrom,
            thursdayTo: service.data.thursdayTo,
            fridayFrom: service.data.fridayFrom,
            fridayTo: service.data.fridayTo,
            saturdayFrom: service.data.saturdayFrom,
            saturdayTo: service.data.saturdayTo,
            sundayFrom: service.data.sundayFrom,
            sundayTo: service.data.sundayTo,
          },
          order: service.order,
          visibility: service.visibility,
        });
      } else if (allServices) {
        const service = allServices.find((item: DataItemsServiceType) => item._id === id);
        if (service) {
          setFormData({
            data: {
              serviceName: service.data.serviceName,
              serviceDescr: service.data.serviceDescr,
              servicePrice: service.data.servicePrice,
              serviceImage: service.data.serviceImage,
              duration: service.data.duration || null,
              simultaneous: service.data.simultaneous || null,
              lunchFrom: service.data.lunchFrom || "",
              lunchTo: service.data.lunchTo || "",
              mondayFrom: service.data.mondayFrom,
              mondayTo: service.data.mondayTo,
              tuesdayFrom: service.data.tuesdayFrom,
              tuesdayTo: service.data.tuesdayTo,
              wednesdayFrom: service.data.wednesdayFrom,
              wednesdayTo: service.data.wednesdayTo,
              thursdayFrom: service.data.thursdayFrom,
              thursdayTo: service.data.thursdayTo,
              fridayFrom: service.data.fridayFrom,
              fridayTo: service.data.fridayTo,
              saturdayFrom: service.data.saturdayFrom,
              saturdayTo: service.data.saturdayTo,
              sundayFrom: service.data.sundayFrom,
              sundayTo: service.data.sundayTo,
            },
            order: service.order,
            visibility: service.visibility,
          });
        }
      }
    } else {
      setFormData(initialValues);
    }
  }, [action, id, services, allServices]);

  const fieldsToValidate = services?.dataSet?.dataschema?.fields.map((field: DataschemaField) => field.name) || [];

  const errors = useFormValidator(formData, fieldsToValidate);

  const ErrorMessage = ({ error, name }: { error: string | undefined; name?: string }) => {
    const errorClass = name?.startsWith("lunch")
      ? styles.error_lunchFrom
      : name?.startsWith("description")
        ? styles.error_textarea
        : name?.startsWith("image")
          ? styles.error_image
          : styles.error;

    return <p className={errorClass ? errorClass : styles.error_hidden}>{error}</p>;
  };

  const postDataItem = async (formData: PostDataItem) => {
    setLoading(true);
    const data = await post("dataitem", formData, ENV.BOX);
    if (data.data.statusCode === 201) {
      setLoading(false);
      handleAddService(data.data.data);
      notify(dict("toast.success_item"));
      setShowPopup(false);
    } else {
      notifyError(dict("toast.error_file"));
    }
  };

  const putDataItem = async (formData: PutDataItem, id: string) => {
    setLoading(true);
    const data = await update("dataitem", formData, id, ENV.BOX);
    if (data.statusCode === 200) {
      setShowPopup(false);
      notify(dict("toast.success_edit"));
      setLoading(false);
      if (onUpdate) {
        onUpdate(data.data);
      } else {
        handleUpdateService(data.data);
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

  const handleTimePickerChange = (name: string, value: Date | null) => {
    setFormData((prevState: InitialValuesProps) => ({
      ...prevState,
      data: {
        ...prevState.data,
        [name]: value ? moment(value).format("HH:mm:ss") : "",
      },
    }));
  };

  const parseTime = (value: string | undefined) => {
    if (!value || value.trim() === "") return null;
    const [hours, minutes, seconds] = value.split(":").map(num => parseInt(num, 10));
    return new Date(1970, 0, 1, hours, minutes, seconds);
  };

  const handleVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isVisible = e.target.checked;
    setFormData((prevState: InitialValuesProps) => ({
      ...prevState,
      visibility: isVisible,
    }));
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckValidation(true);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const dataToSend = {
          dataset: services?.dataSet._id ?? "",
          data: formData.data,
          visibility: formData.visibility,
          ...(formData.order !== null && { order: formData.order }),
        };
        if (file) {
          const uploadedImageUrl = await handleFileUpload(file);
          if (uploadedImageUrl) {
            dataToSend.data.serviceImage = uploadedImageUrl;
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
          <div className={styles.column_one}>
            <div className={styles.form_control}>
              <Input
                type='text'
                textLabel={dict("catalog.services.serviceName")}
                textHolder='My business name'
                name='serviceName'
                required
                value={formData.data?.serviceName || ""}
                handleChange={handleChange}
              />
              {checkValidation && <ErrorMessage error={errors.serviceName} />}
            </div>

            <div className={styles.form_control}>
              <Input
                type='textarea'
                textLabel={dict("catalog.services.serviceDescr")}
                textHolder=' My business description'
                name='serviceDescr'
                required
                value={formData.data?.serviceDescr || ""}
                handleChange={handleChange}
              />
              {checkValidation && <ErrorMessage error={errors.serviceDescr} name='description' />}
            </div>

            <Input
              type='text'
              textLabel={dict("catalog.order")}
              textHolder=''
              textDescription={dict("catalog.form_actions.order_description")}
              name='order'
              value={formData.order ?? ""}
              handleChange={handleChange}
            />
            <CheckBox text='Visible on my apps' active={formData.visibility} onChange={handleVisibility} />
          </div>
          <div className={checkValidation ? `${styles.column_two} ${styles.column_two_errors}` : styles.column_two}>
            <div className={styles.form_control}>
              <Input
                type='number'
                textLabel={dict("catalog.services.servicePrice")}
                textHolder=''
                name='servicePrice'
                required
                inputPrice
                value={formData.data?.servicePrice ?? ""}
                handleChange={handleChange}
              />
              {checkValidation && <ErrorMessage error={errors.servicePrice} />}
            </div>

            <div className={styles.extra_config}>
              <p className={styles.extra_config_title}>Extra Config</p>
              <div className={styles.extra_config_row}>
                <div className={styles.form_control}>
                  <DatePicker
                    selected={parseTime(formData.data.lunchFrom) || null}
                    onChange={(date: Date | null) => handleTimePickerChange("lunchFrom", date)}
                    className={styles["custom-datepicker"]}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption='Time'
                    dateFormat='HH:mm:ss'
                    placeholderText={dict("catalog.services.from")}
                  />
                  {checkValidation && <ErrorMessage error={errors.lunchFrom} name='lunch' />}
                </div>

                <div className={styles.form_control}>
                  <DatePicker
                    selected={parseTime(formData.data.lunchTo) || null}
                    onChange={(date: Date | null) => handleTimePickerChange("lunchTo", date)}
                    className={styles["custom-datepicker"]}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption='Time'
                    dateFormat='HH:mm:ss'
                    placeholderText={dict("catalog.services.to")}
                  />
                  {checkValidation && <ErrorMessage error={errors.lunchTo} name='lunch' />}
                </div>
              </div>
              <div className={styles.form_control}>
                <Input
                  type='number'
                  textLabel={dict("catalog.services.duration")}
                  textHolder='60'
                  name='duration'
                  required
                  value={formData.data?.duration ?? ""}
                  handleChange={handleChange}
                />
                {checkValidation && <ErrorMessage error={errors.duration} />}
              </div>

              <div className={styles.form_control}>
                <Input
                  type='number'
                  textLabel={dict("catalog.services.simultaneous")}
                  textHolder='#'
                  name='simultaneous'
                  required
                  value={formData.data?.simultaneous ?? ""}
                  handleChange={handleChange}
                />
                {checkValidation && <ErrorMessage error={errors.simultaneous} />}
              </div>
            </div>
          </div>
          <div className={styles.column_three}>
            <label className={styles.label}>{dict("catalog.form_actions.image")}</label>
            <div className={styles.form_control}>
              <DragAndDrop type='image' file={file} setFile={setFile} currentImage={imageUrl} />
            </div>
          </div>
        </div>
        <div className={styles.available_days_container}>
          <p className={styles.available_days_title}>
            {dict("catalog.available_days_form")}
            <span>(Click para activar dias)</span>
          </p>
          <div className={styles.days_container}>
            <DayInput
              action={action}
              formData={formData}
              handleChange={handleTimePickerChange}
              errors={errors}
              checkValidation={checkValidation}
            />
          </div>
        </div>
        <div
          className={errors ? `${styles.button_container} ${styles.button_container_errors}` : styles.button_container}
        >
          <Button title={dict("catalog.form_actions.save_service")} type='submit' loading={loading} />
        </div>
      </div>
    </form>
  );
};

export default Form;
