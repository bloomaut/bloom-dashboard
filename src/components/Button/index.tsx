import Image from "next/image";
import styles from "./styles.module.scss";

interface ButtonProps {
  onclick?: () => void;
  title: string;
  icon?: string;
  styleName?: string;
  isDisabled?: boolean;
  type?: string;
}

const Button = ({ title, icon, styleName, onclick, isDisabled, type }: ButtonProps) => {
  return (
    <button
      className={`${styles.btn} ${styleName ? styles[styleName] : styles.btn}`}
      onClick={onclick}
      disabled={isDisabled}
    >
      {icon && <Image src={icon} width={30} height={25} alt='icon' />}
      {title}
    </button>
  );
};

export default Button;
