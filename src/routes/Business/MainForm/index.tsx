import styles from "./styles.module.scss";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import { useBusinessContext } from "@/context/BusinessContext";

const Form = () => {
  const dict = useTranslations("dict.business");
  const { userData } = useBusinessContext();

  const handleChange = () => {
    null;
  };

  console.log(userData);

  return (
    <form className={styles.main_form}>
      <div className={styles.input_name}>
        <Input
          textLabel={dict("form.name")}
          textHolder={dict("form.name")}
          type='text'
          name='name'
          value={userData?.name || ""}
          handleChange={handleChange}
        />
        <Input
          textLabel={dict("form.last_name")}
          textHolder={dict("form.last_name")}
          type='text'
          name='last_name'
          value={userData?.lastname || ""}
          handleChange={handleChange}
        />
      </div>
      <Input
        textLabel={dict("form.business_name")}
        textHolder={dict("form.business_name")}
        type='text'
        name='business_name'
        value={userData?.client.name || ""}
        handleChange={handleChange}
      />
      <div className={styles.select}>
        <label>{dict("form.type_business")}</label>
        <select>
          <option>Select industry</option>
          {userData?.client.category &&
            // No se que dato es ni cual vendrá en category
            userData?.client.category.map((category: any) => <option key={userData.id}>{category}</option>)}
        </select>
      </div>
      <Input
        textLabel={dict("form.describe_business")}
        textHolder={dict("form.describe_business")}
        type='textarea'
        name='describe_business'
        value={userData?.client.description || ""}
        handleChange={handleChange}
      />
    </form>
  );
};

export default Form;
