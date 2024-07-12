import styles from "./styles.module.scss";
import Title from "@/components/Title";
import { useTranslations } from "next-intl";

interface Props {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: Props) => {
  return (
    <header>
      <Title text={title} />
      <h4 className={styles.subtitle}>{subtitle}</h4>
    </header>
  );
};

export default Header;
