import { useDesignContext } from "@/context/DesignContext";
import styles from "./styles.module.scss";
import Image from "next/image";
import InputDesign from "../InputDesign";
import DragAndDrop from "@/components/DragAndDrop";
import Button from "@/components/Button";
import { post } from "@/services/fetch";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { VariablesFormDesign } from "@/typescript/interfaces/designs.interface";
import { ENV } from "@/typescript/types/api";
import { useMessageToast } from "@/hooks/useMessageToast";

type FormValues = {
  title: string;
  description: string;
  variables: VariablesFormDesign[];
};

const DesignForm = () => {
  const { designSelected } = useDesignContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>(() => {
    const initialValues: FormValues = {
      title: "",
      description: "",
      variables:
        designSelected?.variables.map(field => ({
          key: field.name,
          name: field.name,
          description: field.description,
          value: field.value || "",
          target: field.target,
        })) || [],
    };

    return initialValues;
  });
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  const handleInputChange = (name: string, value: string) => {
    if (name === "title" || name === "description") {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: value,
      }));
    } else {
      setFormValues(prevValues => ({
        ...prevValues,
        variables: prevValues.variables.map(variable => (variable.name === name ? { ...variable, value } : variable)),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formValues.title,
      description: formValues.description,
      variables: formValues.variables.map(variable => ({
        key: variable.key,
        name: variable.name,
        description: variable.description,
        value: variable.value,
        target: variable.target,
      })),
      pwa_id: designSelected?.powerapp._id || "",
      flake_id: designSelected?.flake._id || "",
      type_design: designSelected?.type_design || "",
    };

    const response = await post("design-small/create", payload, ENV.DASHBOARD);
    console.log("Valores del formulario a enviar:", response);
    if (response.data.statusCode === 201) {
      notify(dict("toast.success_design"));
      setLoading(false);
    } else {
      notifyError(dict("toast.error_design"));
      setLoading(false);
    }
  };

  return (
    <section className={styles.step_two}>
      <div className={styles.design_preview}>
        <h4 className={styles.img_title}>{dict("designs.create_design.title")}</h4>
        <div className={styles.img_container}>
          <Image
            src={designSelected?.flake.thumbnail || ""}
            alt={designSelected?.flake.title || ""}
            width={500}
            height={500}
          />
        </div>
        <div className={styles.img_form}>
          <InputDesign
            description={dict("designs.create_design.input_title")}
            target='text'
            name='title'
            value={formValues.title || ""}
            onChange={handleInputChange}
          />
          <InputDesign
            description={dict("designs.create_design.input_description")}
            target='text'
            name='description'
            value={formValues.description || ""}
            onChange={handleInputChange}
          />
          <div className={styles.pwa_text}>
            <p className={styles.pwa}>{dict("designs.create_design.pwa_diffusion")}</p>
            <p className={styles.name}>{designSelected?.powerapp.title}</p>
          </div>
        </div>
      </div>
      <div className={styles.design_form}>
        <h3 className={styles.title}>
          <span>{designSelected?.type_design}:</span> {dict("designs.create_design.promotion")}
        </h3>
        <div className={styles.form_container}>
          <p className={styles.field}>{dict("designs.create_design.fields")}</p>
          <form onSubmit={handleSubmit}>
            {formValues.variables.map(variable => (
              <InputDesign
                key={variable.name}
                description={variable.description}
                target={variable.target}
                name={variable.name}
                value={variable.value}
                onChange={(name, value) => handleInputChange(name, value)}
              />
            ))}
          </form>
        </div>
        {/* <DragAndDrop type='image' file={null} setFile={null} currentImage={null} /> */}
        <div className={styles.user_variables}>
          <h6 className={styles.title}>
            {dict("designs.create_design.user_variables")}{" "}
            <span>*These fields will be completed during user registration.</span>
          </h6>
          <InputDesign
            description='User name'
            target='text'
            name='name'
            value=''
            disabled={true}
            onChange={handleInputChange}
          />
          <InputDesign
            description='User phone'
            target='text'
            name='phone'
            value=''
            disabled={true}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className={styles.button} onClick={handleSubmit}>
        <Button title={dict("designs.create_design.create")} loading={loading} />
      </div>
    </section>
  );
};

export default DesignForm;
