"use client";
import styles from "./styles.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";

//Componentes
import SectionTitle from "@/components/SectionTitle";
import Input from "@/components/Input";

interface PropsForm {
  submitForm: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({ submitForm }: PropsForm) => {
  const dict = useTranslations("dict.business.form");
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    instagram: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <SectionTitle text={dict("title")} />
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
