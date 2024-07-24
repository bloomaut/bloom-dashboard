import Input from "@/components/Input";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { UserBusiness } from "@/typescript/interfaces/business.interface";

interface AddInfoFormProps {
  formData: UserBusiness;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AddInfoForm = ({ formData, onChange }: AddInfoFormProps) => {
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
          handleChange={onChange}
        />
      </div>
      <div className={styles.input}>
        <label>{dict("data.instagram")}</label>
        <Input
          textHolder={"@JohnDoe"}
          type='text'
          name='business_instagram'
          value={formData.client.instagram || ""}
          handleChange={onChange}
        />
      </div>
      <div className={styles.input}>
        <label>{dict("data.phone")}</label>
        <Input
          textHolder={"112155...."}
          type='text'
          name='phone'
          value={formData.phone || ""}
          handleChange={onChange}
        />
      </div>
    </form>
  );
};

export default AddInfoForm;
