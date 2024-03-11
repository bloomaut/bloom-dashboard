import styles from "./styles.module.scss";
import arrowRigth from "/public/icons/arrow_rigth.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useLocale } from "next-intl";

const Checkbox = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const router = useRouter();
  const locale = useLocale();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    setIsButtonDisabled(!event.target.checked);
  };

  const handleButtonClick = () => {
    router.push(`/${locale}/playground`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.checkbox}>
        <input type='checkbox' id='checkbox' checked={isChecked} onChange={handleCheckboxChange} />
        <label htmlFor='checkbox'>Ya vi el video y deseo continuar</label>
      </div>
      <Button
        title='Continuar'
        icon={arrowRigth}
        onclick={handleButtonClick}
        isDisabled={isButtonDisabled}
        styleName={isButtonDisabled ? "btn_disabled" : "btn"}
      />
    </div>
  );
};

export default Checkbox;
