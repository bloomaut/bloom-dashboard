import Title from "@/components/Title";
import styles from "./styles.module.scss";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useTranslations } from "next-intl";

const Header = () => {
  const dict = useTranslations("dict.catalog");

  return (
    <div className={styles.header}>
      <Title text={dict("title")} />
      <div className={styles.btn_container}>
        <Button
          title={dict("ia")}
          icon={<Icon name='ia' strokeColor='#7f7f7f' viewBox='0 0 25 21' />}
          styleName='btn_outline'
        />
        <Button
          title={dict("new")}
          icon={<Icon name='add' strokeWidth={3} strokeColor='#fff' viewBox='0 0 25 21' />}
          styleName='btn_reverse'
        />
      </div>
    </div>
  );
};

export default Header;
