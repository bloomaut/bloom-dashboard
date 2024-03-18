"use client";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { ENV } from "@/typescript/types/environment.enum";
import { useTranslations } from "next-intl";
import { useMessageToast } from "@/hooks/useMessageToast";

//Componentes
import Input from "@/components/Input";
import Subtitle from "../Subtitle";
import { update } from "@/services/fetch";
import { setBusinessData } from "@/store/features/businessSlice";

const Form = () => {
  const dict = useTranslations("dict.business.form");
  const business = useAppSelector(data => data.business);
  const dispatch = useAppDispatch();
  const { notify, notifyError } = useMessageToast();
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    instagram: "",
    phone: "",
  });

  useEffect(() => {
    setFormData({
      name: business.name || "",
      website: business.website || "",
      description: business.description || "",
      instagram: business.instagram || "",
      phone: business.phone || "",
    });
  }, [business]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await update("small-business", formData, ENV.DASH);
      if (response.data.statusCode === 200) {
        dispatch(setBusinessData(response.data.result.data));
        notify("Información actualizada correctamente");
      }
    } catch (error) {
      notifyError("Hubo un error al actualizar la información");
    }
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpdate();
  };

  return (
    <div className={styles.container}>
      <Subtitle text={dict("title")} />
      <h4>*{dict("subtitle")}</h4>
      <form className={styles.form} onSubmit={submitForm}>
        <Input
          textLabel={dict("name")}
          textHolder={dict("placeholder_name")}
          type='text'
          name='name'
          value={formData.name}
          handleChange={handleChange}
        />
        <Input
          textLabel={dict("website")}
          textHolder={dict("placeholder_website")}
          type='text'
          name='website'
          value={formData.website}
          handleChange={handleChange}
        />
        <Input
          textLabel={dict("description")}
          textHolder={dict("placeholder_description")}
          type='text'
          name='description'
          value={formData.description}
          handleChange={handleChange}
          isDescription={true}
        />
        <Input
          textLabel='Instagram'
          textHolder={dict("placeholder_instagram")}
          type='text'
          name='instagram'
          value={formData.instagram}
          handleChange={handleChange}
        />
        <Input
          textLabel={dict("phone")}
          textHolder={dict("placeholder_phone")}
          type='text'
          name='phone'
          value={formData.phone}
          handleChange={handleChange}
        />
        <div className={styles.btn_container}>
          <button className={styles.btn}>{dict("button")}</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
