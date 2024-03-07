import Link from "next/link";
import styles from "./styles.module.scss";
import { ButtonProps } from "@/utils/types/types";

const Button: React.FC<ButtonProps> = props => {
  return (
    <Link
      className={`${styles[props.styleName || ""]} ${styles.btn}`}
      target={props.type === "wp" ? "_blank" : "_self"}
      href={props.href}
    >
      {props.title} {props.icon}
    </Link>
  );
};

export default Button;
