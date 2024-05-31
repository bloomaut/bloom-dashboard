import styles from "./styles.module.scss";

interface ButtonProps {
  onclick?: () => void;
  title: string;
  icon?: JSX.Element;
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
      {icon}
      {title}
    </button>
  );
};

export default Button;
