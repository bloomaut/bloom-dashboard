import styles from "./styles.module.scss";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { FormErrorsProps } from "@/hooks/useFormValidator";
import Select from "./Select";

interface FormProps {
  formData: UserBusiness;
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  validation: boolean;
  errors: FormErrorsProps;
  loading: boolean;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  formRef: React.RefObject<HTMLFormElement>;
}

const Form = ({ formData, onChange, onSubmit, validation, errors, loading, onCategoryChange, formRef }: FormProps) => {
  const dict = useTranslations("dict.business");

  const ErrorMessage = ({ error }: { error: string | undefined }) => (
    <p className={error ? styles.error : styles.error_hidden}>{error}</p>
  );

  return (
    <form className={styles.main_form} onSubmit={onSubmit} ref={formRef}>
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
        <Select name='business_category' value={formData.client.category || ""} onChange={onCategoryChange} />
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
    </form>
  );
};

export default Form;
