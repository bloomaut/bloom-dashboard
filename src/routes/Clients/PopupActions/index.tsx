import styles from "./styles.module.scss";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import Input from "@/components/Input";
import closeIcon from "../../../../public/icons/close.svg";
import Image from "next/image";
import Button from "@/components/Button";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { post, update } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { useAppSelector } from "@/store/hooks";
import { useTranslations } from "next-intl";

interface PopupActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  setShowPopup: (value: SetStateAction<boolean>) => void;
  setClientSelected: Dispatch<SetStateAction<ClientsProps | null>>;
  title: string;
  buttonText: string;
  requestType: "POST" | "PUT";
  clientId?: string;
}

const PopupActions = ({
  onCancel,
  setShowPopup,
  setClientSelected,
  title,
  buttonText,
  onSubmit,
  requestType,
  clientId,
}: PopupActionsProps) => {
  const { dropdownRef } = useCloseDropdown(setShowPopup);
  const { notify, notifyError } = useMessageToast();
  const clients = useAppSelector(state => state.clients);
  const [formData, setFormData] = useState<ClientsProps>({
    ClientFirstname: "",
    ClientLastname: "",
    ClientEmail: "",
    ClientPhone: "",
    ClientLocation: "",
    // note: "",
  });
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
    if (requestType === "POST") {
      postClient();
    } else {
      editClient();
    }
  };

  const postClient = async () => {
    try {
      // const dataToSend = { ...formData };
      // if (!formData.note) {
      //   delete dataToSend.note;
      // }
      const data = await post("client-customer", formData, ENV.DASH);
      if (data.data.statusCode === 201) {
        notify(dict("toast.client_post"));
        setShowPopup(false);
        setFormData({
          ClientFirstname: "",
          ClientLastname: "",
          ClientEmail: "",
          ClientPhone: "",
          ClientLocation: "",
        });
        onSubmit();
        setClientSelected(null);
      } else {
        notifyError(dict("toast.client_post_error"));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const editClient = async () => {
    try {
      const data = await update("client-customer", ENV.DASH, formData, clientId);
      if (data.statusCode === 200) {
        notify(dict("toast.client_edit"));
        setShowPopup(false);
        setFormData({
          ClientFirstname: "",
          ClientLastname: "",
          ClientEmail: "",
          ClientPhone: "",
          ClientLocation: "",
        });
        onSubmit();
        setClientSelected(null);
      } else {
        notifyError(dict("toast.client_edit_error"));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className={styles.popup_container}>
      <div className={styles.container} ref={dropdownRef}>
        <button className={styles.close} onClick={onCancel}>
          <Image src={closeIcon} alt='close' />
        </button>
        <p className={styles.title}>{title}</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.names}>
            <Input
              textLabel={dict("clients.form_label_01")}
              textHolder={dict("clients.form_label_01")}
              type='text'
              name='ClientFirstname'
              value={formData.ClientFirstname}
              handleChange={handleInputChange}
            />
            <Input
              textLabel={dict("clients.form_label_02")}
              textHolder={dict("clients.form_label_02")}
              type='text'
              name='ClientLastname'
              value={formData.ClientLastname}
              handleChange={handleInputChange}
            />
          </div>
          <Input
            textLabel={dict("clients.form_label_03")}
            textHolder={dict("clients.form_label_03")}
            type='email'
            name='ClientEmail'
            value={formData.ClientEmail}
            handleChange={handleInputChange}
          />
          <Input
            textLabel={dict("clients.form_label_04")}
            textHolder={dict("clients.form_label_04")}
            type='text'
            name='ClientLocation'
            value={formData.ClientLocation}
            handleChange={handleInputChange}
          />
          <Input
            textLabel={dict("clients.form_label_05")}
            textHolder={dict("clients.form_label_05")}
            type='text'
            name='ClientPhone'
            value={formData.ClientPhone}
            handleChange={handleInputChange}
          />
          {/* <Input
            textLabel={dict("clients.form_label_06")}
            textHolder={dict("clients.form_label_06")}
            type='textarea'
            name='note'
            value={formData.note || ""}
            handleChange={handleInputChange}
          /> */}
          <div className={styles.btn_container}>
            <Button title={buttonText} type='submit' styleName='btn' />
          </div>
        </form>
      </div>
    </section>
  );
};

export default PopupActions;
