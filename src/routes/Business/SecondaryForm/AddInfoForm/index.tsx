import Input from "@/components/Input";
import styles from "./styles.module.scss";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";

const AddInfoForm = () => {
  const dict = useTranslations("dict.business");

  // eslint-disable-next-line no-empty-function
  const handleChange = () => {};

  return (
    <form className={styles.add_info}>
      <h6 className={styles.subtitle}>{dict("data.add_info")}</h6>
      <div className={styles.input}>
        <label>{dict("data.website")}</label>
        <Input textHolder={dict("data.website")} type='text' name='website' value='' handleChange={handleChange} />
      </div>
      <div className={styles.input}>
        <label>{dict("data.instagram")}</label>
        <Input textHolder={dict("data.instagram")} type='text' name='instagram' value='' handleChange={handleChange} />
      </div>
      <div className={styles.input}>
        <label>{dict("data.phone")}</label>
        <Input textHolder={dict("data.phone")} type='text' name='phone' value='' handleChange={handleChange} />
      </div>
      <div className={styles.btn_next}>
        <Button title='Next' />
      </div>
    </form>
  );
};

export default AddInfoForm;
