import styles from "./styles.module.scss";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { userInitialState } from "@/store/features/userSlice";

const Form = () => {
  const dict = useTranslations("dict.business");
  const [formData, setFormData] = useState<UserBusiness>(userInitialState);
  const userData = useAppSelector(state => state.userData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

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
          handleChange={handleChange}
        />
        <Input
          textLabel={dict("form.last_name")}
          textHolder={dict("form.last_name")}
          type='text'
          name='lastname'
          value={formData.lastname || ""}
          handleChange={handleChange}
        />
      </div>
      <Input
        textLabel={dict("form.business_name")}
        textHolder={dict("form.business_name")}
        type='text'
        name='client.name'
        value={formData.client.name || ""}
        handleChange={handleChange}
      />
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
        name='client.description'
        value={formData.client.description || ""}
        handleChange={handleChange}
      />
      <button type='submit'>Submit</button>
    </form>
  );
};

export default Form;
