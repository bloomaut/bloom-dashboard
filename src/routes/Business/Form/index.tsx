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

interface FormDataProps {
  name: string;
  website: string;
  description: string;
  instagram: string;
  phone: string;
}

const Form = () => {
  const dict = useTranslations("dict");
  const business = useAppSelector(data => data.business);
  const dispatch = useAppDispatch();
  const { notify, notifyError } = useMessageToast();
  const [formData, setFormData] = useState<FormDataProps>({
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
      if (formData.name.trim() === "") {
        notifyError(`${dict("toast.error_name")}`);
        return;
      }

      const response = await update("small-business", formData, ENV.DASH);
      if (response.data.statusCode === 200) {
        dispatch(setBusinessData(response.data.result.data));
        notify(`${dict("toast.success_edit")}`);
      }
    } catch (error) {
      notifyError(`${dict("toast.error_edit")}`);
    }
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpdate();
  };

  return (
    <div className={styles.container}>
      <Subtitle text={dict("business.form.title")} />
      <h4>*{dict("business.form.subtitle")}</h4>
      <form className={styles.form} onSubmit={submitForm}>
        <Input
          textLabel={dict("business.form.name")}
          textHolder={dict("business.form.placeholder_name")}
          type='text'
          name='name'
          value={formData.name}
          handleChange={handleChange}
        />
        <Input
          textLabel={dict("business.form.website")}
          textHolder={dict("business.form.placeholder_website")}
          type='text'
          name='website'
          value={formData.website}
          handleChange={handleChange}
        />
        <Input
          textLabel={dict("business.form.description")}
          textHolder={dict("business.form.placeholder_description")}
          type='text'
          name='description'
          value={formData.description}
          handleChange={handleChange}
          isDescription={true}
        />
        <Input
          textLabel='Instagram'
          textHolder={dict("business.form.placeholder_instagram")}
          type='text'
          name='instagram'
          value={formData.instagram}
          handleChange={handleChange}
        />
        <Input
          textLabel={dict("business.form.phone")}
          textHolder={dict("business.form.placeholder_phone")}
          type='text'
          name='phone'
          value={formData.phone}
          handleChange={handleChange}
        />
        <div className={styles.btn_container}>
          <button className={styles.btn}>{dict("business.form.button")}</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
