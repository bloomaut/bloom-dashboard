import styles from "./styles.module.scss";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { FormErrorsProps } from "@/hooks/useFormValidator";
import Button from "@/components/Button";
import Select from "./Select";

interface FormProps {
  userData?: UserBusiness;
  formData: UserBusiness;
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<UserBusiness>>;
  validation: boolean;
  errors: FormErrorsProps;
  loading: boolean;
  category: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const initialFormData: UserBusiness = {
  name: "",
  lastname: "",
  client: {
    name: "",
    description: "",
    category: "",
    logo: "",
    banner: "",
    palette: [],
    company_web: "",
    instagram: "",
  },
  phone: "",
};

const Form = ({
  formData,
  onChange,
  onSubmit,
  setFormData,
  userData,
  validation,
  errors,
  loading,
  category,
  onCategoryChange,
}: FormProps) => {
  const dict = useTranslations("dict.business");

  const ErrorMessage = ({ error }: { error: string | undefined }) => (
    <p className={error ? styles.error : styles.error_hidden}>{error}</p>
  );

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    } else {
      setFormData(initialFormData);
    }
  }, [userData]);

  return (
    <form className={styles.main_form} onSubmit={onSubmit}>
      <div className={styles.row_01}>
        <div className={styles.form_control}>
          <Input
            textLabel={dict("form.name")}
            textHolder={dict("form.name")}
            type='text'
            name='name'
            value={formData.name || ""}
            handleChange={onChange}
          />
          {validation && <ErrorMessage error={errors.name} />}
        </div>
        <div className={styles.form_control}>
          <Input
            textLabel={dict("form.last_name")}
            textHolder={dict("form.last_name")}
            type='text'
            name='lastname'
            value={formData.lastname || ""}
            handleChange={onChange}
          />
          {validation && <ErrorMessage error={errors.lastname} />}
        </div>
      </div>
      <div className={styles.row_02}>
        <Input
          textLabel={dict("form.business_name")}
          textHolder={dict("form.business_name")}
          type='text'
          name='business_name'
          value={formData.client.name || ""}
          handleChange={onChange}
        />
        {validation && <ErrorMessage error={errors.business_name} />}
      </div>
      <div className={styles.row_03}>
        <label>{dict("form.type_business")}</label>
        <Select name='business_category' value={formData.client.category || category} onChange={onCategoryChange} />
        {validation && <ErrorMessage error={errors.business_category} />}
      </div>
      <div className={styles.row_04}>
        <Input
          textLabel={dict("form.describe_business")}
          textHolder={dict("form.describe_business")}
          type='textarea'
          name='business_description'
          value={formData.client.description || ""}
          handleChange={onChange}
        />
        {validation && <ErrorMessage error={errors.business_description} />}
      </div>
      <Button title='Enviar' loading={loading} type='submit' />
    </form>
  );
};

export default Form;
