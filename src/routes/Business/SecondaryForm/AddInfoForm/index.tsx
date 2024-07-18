import Input from "@/components/Input";
import styles from "./styles.module.scss";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { useRouter } from "@/navigation";
import useStepValidation from "@/hooks/useStepValidation";

interface AddInfoFormProps {
  formData: UserBusiness;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AddInfoForm = ({ formData, onChange }: AddInfoFormProps) => {
  const dict = useTranslations("dict.business");
  const { step_01, step_04 } = useStepValidation();
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/templates");
  };

  return (
    <form className={styles.add_info}>
      <h6 className={styles.subtitle}>{dict("data.add_info")}</h6>
      <div className={styles.input}>
        <label>{dict("data.website")}</label>
        <Input
          textHolder={dict("data.website")}
          type='text'
          name='business_company_web'
          value={formData.client.company_web || ""}
          handleChange={onChange}
        />
      </div>
      <div className={styles.input}>
        <label>{dict("data.instagram")}</label>
        <Input
          textHolder={dict("data.instagram")}
          type='text'
          name='business_instagram'
          value={formData.client.instagram || ""}
          handleChange={onChange}
        />
      </div>
      <div className={styles.input}>
        <label>{dict("data.phone")}</label>
        <Input
          textHolder={dict("data.phone")}
          type='text'
          name='phone'
          value={formData.phone || ""}
          handleChange={onChange}
        />
      </div>
      <div className={styles.btn_next}>
        {!step_04 && <Button title='Next' isDisabled={!step_01} onclick={handleNavigation} />}
      </div>
    </form>
  );
};

export default AddInfoForm;
