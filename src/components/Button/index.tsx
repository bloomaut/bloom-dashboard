// import styles from "./styles.module.scss";

// interface Props {
//   text: string;
// }

// const Button = ({ text }: Props) => {
//   return <button className={styles.btn}>{text}</button>;
// }

import Link from "next/link";
import styles from "./styles.module.scss";

interface ButtonProps {
  href: string;
  title: string;
  icon?: string;
  styleName?: string;
  type?: string;
}

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
