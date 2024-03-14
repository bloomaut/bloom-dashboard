"use client";
import styles from "./styles.module.scss";
import { useState } from "react";
//Componentes
import SectionTitle from "@/components/SectionTitle";
import Input from "@/components/Input";

interface PropsForm {
  submitForm: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({ submitForm }: PropsForm) => {
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
      <SectionTitle text='Información del negocio' />
      <h4>*Mientras más campos se completen mejor será el resultado</h4>
      <form className={styles.form} onSubmit={submitForm}>
        <Input
          textLabel='Nombre'
          textHolder='Ingrese el nombre'
          type='text'
          name='name'
          value={formData.name}
          handleChange={handleChange}
        />
        <Input
          textLabel='Sitio web'
          textHolder='Ingrese el sitio web'
          type='text'
          name='website'
          value={formData.website}
          handleChange={handleChange}
        />
        <Input
          textLabel='Descripción'
          textHolder='Ingrese una descripción'
          type='text'
          name='description'
          value={formData.description}
          handleChange={handleChange}
          isDescription={true}
        />
        <Input
          textLabel='Instagram'
          textHolder='Ingrese el instagram'
          type='text'
          name='instagram'
          value={formData.instagram}
          handleChange={handleChange}
        />
        <Input
          textLabel='Teléfono'
          textHolder='Ingrese el teléfono'
          type='text'
          name='phone'
          value={formData.phone}
          handleChange={handleChange}
        />
        <div className={styles.btn_container}>
          <button className={styles.btn}>Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
