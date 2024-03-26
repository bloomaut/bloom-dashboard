import styles from "./styles.module.scss";
import { ChangeEvent, SetStateAction, useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import Input from "@/components/Input";
import closeIcon from "../../../../public/icons/close.svg";
import Image from "next/image";
import Button from "@/components/Button";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { post } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";

interface PopupCreateProps {
  onCancel: () => void;
  setShowPopup: (value: SetStateAction<boolean>) => void;
  title: string;
  buttonText: string;
}

const FormCreate = ({ onCancel, setShowPopup, title, buttonText }: PopupCreateProps) => {
  const { dropdownRef } = useCloseDropdown(setShowPopup);
  const { notify, notifyError } = useMessageToast();
  const [formData, setFormData] = useState<ClientsProps>({
    ClientFirstname: "",
    ClientLastname: "",
    ClientEmail: "",
    ClientPhone: "",
    ClientLocation: "",
    // note: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fieldName = e.target.name as keyof FormData;
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    postClient();
  };

  const postClient = async () => {
    try {
      // const dataToSend = { ...formData };
      // if (!formData.note) {
      //   delete dataToSend.note;
      // }
      const data = await post("client-customer", formData, ENV.DASH);
      if (data.data.statusCode === 201) {
        notify("Cliente creado correctamente");
        setShowPopup(false);
        setFormData({
          ClientFirstname: "",
          ClientLastname: "",
          ClientEmail: "",
          ClientPhone: "",
          ClientLocation: "",
        });
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
              textLabel='Nombre'
              textHolder='Nombre'
              type='text'
              name='ClientFirstname'
              value={formData.ClientFirstname}
              handleChange={handleInputChange}
            />
            <Input
              textLabel='Apellido'
              textHolder='Apellido'
              type='text'
              name='ClientLastname'
              value={formData.ClientLastname}
              handleChange={handleInputChange}
            />
          </div>
          <Input
            textLabel='Email'
            textHolder='Email'
            type='ClientEmail'
            name='ClientEmail'
            value={formData.ClientEmail}
            handleChange={handleInputChange}
          />
          <Input
            textLabel='Teléfono'
            textHolder='Ubicación'
            type='text'
            name='ClientLocation'
            value={formData.ClientLocation}
            handleChange={handleInputChange}
          />
          <Input
            textLabel='Ubicación'
            textHolder='Teléfono'
            type='tel'
            name='ClientPhone'
            value={formData.ClientPhone}
            handleChange={handleInputChange}
          />
          {/* <Input
            textLabel='Notas personales'
            textHolder='Ingrese una descripción...'
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

export default FormCreate;
