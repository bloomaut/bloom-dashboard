import Link from "next/link";
import styles from "./styles.module.scss";

interface ButtonProps {
  href: string;
  title: string;
  icon?: string;
  styleName?: string;
  type?: string;
}

const LinkComponent: React.FC<ButtonProps> = props => {
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

export default LinkComponent;
