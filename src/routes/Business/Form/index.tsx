"use client";
import styles from "./styles.module.scss";
//Componentes
import SectionTitle from "@/components/SectionTitle";
import Input from "@/components/Input";

const Form = () => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(handleChange);
  };
  return (
    <div className={styles.container}>
      <SectionTitle text='Información del negocio' />
      <h4>*Mientras más campos se completen mejor será el resultado</h4>
      <form className={styles.form}>
        <Input
          textLabel='Nombre'
          textHolder='Ingrese el nombre'
          type='text'
          name='nombre'
          value=''
          handleChange={handleChange}
        />
        <Input
          textLabel='Sitio web'
          textHolder='Ingrese el sitio web'
          type='text'
          name='nombre'
          value=''
          handleChange={handleChange}
        />
        <Input
          textLabel='Descripción'
          textHolder='Ingrese una descripción'
          type='text'
          name='nombre'
          value=''
          handleChange={handleChange}
          isDescription={true}
        />
        <Input
          textLabel='Instagram'
          textHolder='Ingrese el instagram'
          type='text'
          name='nombre'
          value=''
          handleChange={handleChange}
        />
        <Input
          textLabel='Teléfono'
          textHolder='Ingrese el teléfono'
          type='text'
          name='nombre'
          value=''
          handleChange={handleChange}
        />
        <button className={styles.btn}>Guardar</button>
      </form>
    </div>
  );
};

export default Form;
