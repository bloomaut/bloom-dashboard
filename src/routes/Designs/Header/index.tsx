import Title from "@/components/Title";
import styles from "./styles.module.scss";
import Image, { StaticImageData } from "next/image";
import hog_logo from "/public/assets/hog_logo.png";
import post_logo from "/public/assets/post_logo.png";
import landing_logo from "/public/assets/landing_logo.png";
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
      icon: <Image src={landing_logo} width={28} height={30} alt='Landing Icon' />,
      label: "Web pages",
      type: "landing",
    },
    {
      icon: <Image src={hog_logo} width={22} height={30} alt='Hog Icon' />,
      label: "Apps",
      type: "hog",
    },
    {
      icon: <Image src={post_logo} width={28} height={26} alt='Post Icon' />,
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
