import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
// Components
import Button from "@/components/Button";

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
        icon={<Icon name='arrow_right' viewBox='0 0 25 25' strokeColor={isChecked ? "#fff" : "#bebebe"} />}
        onclick={handleButtonClick}
        isDisabled={isButtonDisabled}
      />
    </div>
  );
};

export default Checkbox;
