import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";
import Input from "@/components/Input";

const Form = () => {
  const dict = useTranslations("dict.business");

  // eslint-disable-next-line no-empty-function
  const handleChange = () => {};

  return (
    <form className={styles.main_form}>
      <div className={styles.input_name}>
        <Input
          textLabel={dict("form.name")}
          textHolder={dict("form.name")}
          type='text'
          name='name'
          value=''
          handleChange={handleChange}
        />
        <Input
          textLabel={dict("form.last_name")}
          textHolder={dict("form.last_name")}
          type='text'
          name='last_name'
          value=''
          handleChange={handleChange}
        />
      </div>
      <Input
        textLabel={dict("form.business_name")}
        textHolder={dict("form.business_name")}
        type='text'
        name='business_name'
        value=''
        handleChange={handleChange}
      />
      <div className={styles.select}>
        <label>{dict("form.type_business")}</label>
        <select>
          <option>Select industry</option>
        </select>
      </div>
      <Input
        textLabel={dict("form.describe_business")}
        textHolder={dict("form.describe_business")}
        type='textarea'
        name='describe_business'
        value=''
        handleChange={handleChange}
      />
    </form>
  );
};

export default Form;
