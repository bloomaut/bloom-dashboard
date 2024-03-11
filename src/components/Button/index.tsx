import styles from "./styles.module.scss";

interface ButtonProps {
  onclick: () => void;
  title: string;
  icon?: string;
  styleName?: string;
}

const Button: React.FC<ButtonProps> = props => {
  return (
    <button className={`${styles[props.styleName || ""]} ${styles.btn}`} onClick={props.onclick}>
      {props.title} {props.icon}
    </button>
  );
};

export default Button;
