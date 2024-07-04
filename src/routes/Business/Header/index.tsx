import styles from "./styles.module.scss";
import Title from "@/components/Title";
import { useTranslations } from "next-intl";

const Header = () => {
  const dict = useTranslations("dict.business");

  return (
    <header>
      <Title text={dict("form.title")} />
      <h4 className={styles.subtitle}>{dict("form.subtitle")}</h4>
    </header>
  );
};

export default Header;
