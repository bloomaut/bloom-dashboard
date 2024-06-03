import styles from "./styles.module.scss";
import { Oval } from "react-loader-spinner";

interface ButtonProps {
  onclick?: () => void;
  title: string;
  icon?: JSX.Element;
  styleName?: string;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

const Button = ({ title, icon, styleName, onclick, isDisabled, type, loading }: ButtonProps) => {
  return (
    <button
      className={`${styles.btn} ${styleName ? styles[styleName] : styles.btn}`}
      onClick={onclick}
      disabled={isDisabled}
      type={type ?? "button"}
    >
      {loading ? (
        <Oval
          height={25}
          width={25}
          color='#ff3d02'
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor='#ffc8b8'
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      ) : (
        <>
          {icon}
          {title}
        </>
      )}
    </button>
  );
};

export default Button;
