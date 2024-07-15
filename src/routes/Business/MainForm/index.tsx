import styles from "./styles.module.scss";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import useFormValidator from "@/hooks/useFormValidator";

interface FormProps {
  userData?: UserBusiness;
  formData: UserBusiness;
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<UserBusiness>>;
  validation: boolean;
}

const Form = ({ formData, onChange, onSubmit, setFormData, userData, validation }: FormProps) => {
  const fieldsToValidate = ["category_name"];
  const errors = useFormValidator(formData, fieldsToValidate);
  const dict = useTranslations("dict.business");

  const ErrorMessage = ({ error }: { error: string | undefined }) => (
    <p className={error ? styles.error : styles.error_hidden}>{error}</p>
  );

  console.log(formData);

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  return (
    <form className={styles.main_form}>
      <div className={styles.input_name}>
        <Input
          textLabel={dict("form.name")}
          textHolder={dict("form.name")}
          type='text'
          name='name'
          value={formData.name || ""}
          handleChange={onChange}
        />
        {validation && <ErrorMessage error={errors.name} />}
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
      <Input
        textLabel={dict("form.business_name")}
        textHolder={dict("form.business_name")}
        type='text'
        name='business.name'
        value={formData.client.name || ""}
        handleChange={onChange}
      />
      {validation && <ErrorMessage error={errors.business_name} />}
      <div className={styles.select}>
        <label>{dict("form.type_business")}</label>
        <select name='client.category' value={formData.client.category?.join(",") || ""}>
          <option>Select industry</option>
          {formData.client.category &&
            formData.client.category.map((category, index) => <option key={index}>{category}</option>)}
        </select>
      </div>
      <Input
        textLabel={dict("form.describe_business")}
        textHolder={dict("form.describe_business")}
        type='textarea'
        name='business.description'
        value={formData.client.description || ""}
        handleChange={onChange}
      />
      {validation && <ErrorMessage error={errors.business_description} />}
      <button type='submit'>Submit</button>
    </form>
  );
};

export default Form;
