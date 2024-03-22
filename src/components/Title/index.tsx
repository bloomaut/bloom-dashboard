import styles from "./styles.module.scss";
import localFont from "next/font/local";

const myFont = localFont({ src: "../../../public/fonts/kollektif/Kollektif-Bold.ttf" });

interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  return <h1 className={`${styles.title}${myFont.className}`}>{text}</h1>;
};

export default Title;
