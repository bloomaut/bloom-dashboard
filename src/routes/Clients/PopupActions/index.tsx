import styles from "./styles.module.scss";
import useFormValidator from "@/hooks/useFormValidator";
import Icon from "@/components/Icon";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { post, update } from "@/services/fetch";
import { useTranslations } from "next-intl";
import { useClientsContext } from "@/context/ClientsContext";
// Components
import Input from "@/components/Input";
import Button from "@/components/Button";

interface PopupActionsProps {
  onCancel: () => void;
  setShowPopup: (value: SetStateAction<boolean>) => void;
  title: string;
  buttonText: string;
  requestType: "POST" | "PUT";
  clientId?: string;
}

const emptyFormData = {
  ClientFirstname: "",
  ClientLastname: "",
  ClientEmail: "",
  ClientPhone: "",
  ClientLocation: "",
  personalNote: "",
  createdAt: "",
  updatedAt: "",
};

const PopupActions = ({ onCancel, setShowPopup, title, buttonText, requestType, clientId }: PopupActionsProps) => {
  const [formData, setFormData] = useState<ClientsProps>(emptyFormData);
  const [checkValidation, setCheckValidation] = useState(false);
  const { dropdownRef } = useCloseDropdown(setShowPopup);
  const { clients, setClientSelected, updateClients } = useClientsContext();
  const { notify, notifyError } = useMessageToast();
  const fieldsToValidate = ["ClientFirstname"];
  const errors = useFormValidator(formData, fieldsToValidate);
  const dict = useTranslations("dict");

  useEffect(() => {
    if (requestType === "PUT") {
      const foundClient = clients.filter(client => client._id === clientId)[0];
      setFormData({
        ClientFirstname: foundClient.ClientFirstname,
        ClientLastname: foundClient.ClientLastname,
        ClientEmail: foundClient.ClientEmail,
        ClientPhone: foundClient.ClientPhone,
        ClientLocation: foundClient.ClientLocation,
        personalNote: foundClient.personalNote,
        createdAt: foundClient.createdAt,
        updatedAt: foundClient.updatedAt,
      });
    }
  }, [clients, requestType, clientId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fieldName = e.target.name as keyof FormData;
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setCheckValidation(true);
    if (Object.keys(errors).length === 0) {
      const newData = {
        ClientFirstname: formData.ClientFirstname,
        ClientLastname: formData.ClientLastname,
        ClientEmail: formData.ClientEmail,
        ClientPhone: formData.ClientPhone,
        ClientLocation: formData.ClientLocation,
        personalNote: formData.personalNote,
      };
      if (requestType === "POST") {
        postClient(newData);
      } else {
        editClient(newData);
      }
    }
  };

  const postClient = async (newData: ClientsProps) => {
    const data = await post("client-customer", newData);
    if (data.data.statusCode === 201) {
      notify(dict("toast.client_post"));
      setShowPopup(false);
      setFormData(emptyFormData);
      updateClients(data.data.result.data);
      setClientSelected(null);
    } else {
      notifyError(dict("toast.client_post_error"));
    }
  };

  const editClient = async (newData: ClientsProps) => {
    const data = await update("client-customer", newData, clientId);
    if (data.statusCode === 200) {
      notify(dict("toast.client_edit"));
      setShowPopup(false);
      setFormData(emptyFormData);
      updateClients(data.result.data);
      setClientSelected(null);
    } else {
      notifyError(dict("toast.client_edit_error"));
    }
  };

  return (
    <section className={styles.popup_container}>
      <div className={styles.container} ref={dropdownRef}>
        <button className={styles.close} onClick={onCancel}>
          <Icon name='close' width={30} height={30} />
        </button>
        <p className={styles.title}>{title}</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.names}>
            <div className={styles.form_control}>
              <Input
                textLabel={dict("clients.form_label_01")}
                textHolder={dict("clients.form_label_01")}
                type='text'
                name='ClientFirstname'
                value={formData.ClientFirstname}
                handleChange={handleInputChange}
              />
              {checkValidation && (
                <p className={errors.ClientFirstname ? styles.error : styles.error_hidden}>{errors.ClientFirstname}</p>
              )}
            </div>
            <div className={styles.form_control}>
              <Input
                textLabel={dict("clients.form_label_02")}
                textHolder={dict("clients.form_label_02")}
                type='text'
                name='ClientLastname'
                value={formData.ClientLastname || ""}
                handleChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.form_control}>
            <Input
              textLabel={dict("clients.form_label_03")}
              textHolder={dict("clients.form_label_03")}
              type='text'
              name='ClientEmail'
              value={formData.ClientEmail || ""}
              handleChange={handleInputChange}
            />
          </div>
          <div className={styles.form_control}>
            <Input
              textLabel={dict("clients.form_label_04")}
              textHolder={dict("clients.form_label_04")}
              type='text'
              name='ClientLocation'
              value={formData.ClientLocation || ""}
              handleChange={handleInputChange}
            />
          </div>
          <div className={styles.form_control}>
            <Input
              textLabel={dict("clients.form_label_05")}
              textHolder={dict("clients.form_label_05")}
              type='text'
              name='ClientPhone'
              value={formData.ClientPhone || ""}
              handleChange={handleInputChange}
            />
          </div>
          <div className={styles.form_control}>
            <Input
              textLabel={dict("clients.form_label_06")}
              textHolder={dict("clients.form_label_06")}
              type='textarea'
              name='personalNote'
              value={formData.personalNote || ""}
              handleChange={handleInputChange}
            />
          </div>
          <div className={styles.btn_container}>
            <Button title={buttonText} type='submit' styleName='btn' />
          </div>
        </form>
      </div>
    </section>
  );
};

export default PopupActions;
