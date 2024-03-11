import Image from "next/image";
import styles from "./styles.module.scss";

interface ButtonProps {
  onclick: () => void;
  title: string;
  icon?: string;
  styleName?: string;
  isDisabled?: boolean;
}

const Button = ({ title, icon, styleName, onclick, isDisabled }: ButtonProps) => {
  return (
    <button className={`${styles.btn} ${styleName ? styles[styleName] : ""}`} onClick={onclick} disabled={isDisabled}>
      {icon && <Image src={icon} width={30} height={30} alt='icon' />}
      {title}
    </button>
  );
};

export default Button;
