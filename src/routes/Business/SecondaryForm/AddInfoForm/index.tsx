import Input from "@/components/Input";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useBusinessContext } from "@/context/BusinessContext";

const AddInfoForm = () => {
  const { formData, handleChange } = useBusinessContext();
  const dict = useTranslations("dict.business");

  return (
    <form className={styles.add_info}>
      <h6 className={styles.subtitle}>{dict("data.add_info")}</h6>
      <div className={styles.input}>
        <label>{dict("data.website")}</label>
        <Input
          textHolder={"https://mywebsite.com"}
          type='text'
          name='business_company_web'
          value={formData.client.company_web || ""}
          handleChange={handleChange}
        />
      </div>
      <div className={styles.input}>
        <label>{dict("data.instagram")}</label>
        <Input
          textHolder={"@JohnDoe"}
          type='text'
          name='business_instagram'
          value={formData.client.instagram || ""}
          handleChange={handleChange}
        />
      </div>
      <div className={styles.input}>
        <label>{dict("data.phone")}</label>
        <Input
          textHolder={"+54 9 11 15...."}
          type='text'
          name='phone'
          value={formData.phone || ""}
          handleChange={handleChange}
        />
      </div>
    </form>
  );
};

export default AddInfoForm;
