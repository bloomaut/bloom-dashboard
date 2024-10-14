import Title from "@/components/Title";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import Image, { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { useDesignContext } from "@/context/DesignContext";

interface MenusProps {
  icon?: JSX.Element;
  label: string;
  image?: StaticImageData;
  type: string;
}

const Header = () => {
  const { selectedList, setSelectedList } = useDesignContext();
  const dict = useTranslations("dict.designs.header");

  const menus: MenusProps[] = [
    {
      icon: <Icon name='landing' width={25} height={25} viewBox='0 0 32 35' strokeWidth={1.5} />,
      label: "Web pages",
      type: "landing",
    },
    {
      icon: <Icon name='hog' width={25} height={25} viewBox='0 0 32 35' strokeWidth={1.5} />,
      label: "Apps",
      type: "hog",
    },
    {
      icon: <Icon name='post' width={25} height={25} viewBox='0 0 35 27' strokeWidth={0.5} fillColor='#381D2A' />,
      label: "Social Media",
      type: "post",
    },
  ];

  const handleMenuClick = (type: string) => {
    setSelectedList(type);
  };

  return (
    <div className={styles.header}>
      <Title text={dict("my_designs")} />
      <div className={styles.inner_container}>
        <ul className={styles.menus}>
          {menus.slice(0, 4).map((menu, index) => (
            <li
              className={`${styles.menu_item} ${selectedList === menu.type ? styles.selected : ""}`}
              key={index}
              onClick={() => handleMenuClick(menu.type)}
            >
              <div className={styles.menu}>
                {menu.icon && <div className={styles.icon_container}>{menu.icon}</div>}
                {menu.image && <Image src={menu.image.src} width={30} height={30} alt={menu.label} />}
                <p>{menu.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;
