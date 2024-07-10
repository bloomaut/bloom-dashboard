import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
// Components
import Title from "@/components/Title";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

const Header = () => {
  const dict = useTranslations("dict");

  return (
    <div className={styles.header}>
      <Title text={dict("catalog.title")} />
      <div className={styles.btn_container}>
        <Button
          title={dict("catalog.ia")}
          icon={<Icon name='ia' strokeColor='#7f7f7f' viewBox='0 0 25 21' />}
          styleName='btn_outline'
        />
      </div>
    </div>
  );
};

export default Header;
