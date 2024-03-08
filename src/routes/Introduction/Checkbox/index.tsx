import styles from "./styles.module.scss";
import arrowRigth from "/public/icons/arrow_rigth.svg";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Checkbox = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const router = useRouter();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    setIsButtonDisabled(!event.target.checked);
  };

  const handleButtonClick = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.checkbox}>
        <input type='checkbox' id='checkbox' checked={isChecked} onChange={handleCheckboxChange} />
        <label htmlFor='checkbox'>Ya vi el video y deseo continuar</label>
      </div>
      <button
        className={isButtonDisabled ? `${styles.btn_disabled}` : `${styles.btn}`}
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
      >
        <Image src={arrowRigth} alt='arrowLeft' />
        Continuar
      </button>
    </div>
  );
};

export default Checkbox;
