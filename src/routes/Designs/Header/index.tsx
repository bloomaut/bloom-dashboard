import Title from "@/components/Title";
import styles from "./styles.module.scss";
import Search from "@/components/Search";
import Icon from "@/components/Icon";
import uitrade_logo from "/public/assets/logo_uitrade.svg";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { useDesignContext } from "@/context/DesignContext";

interface MenusProps {
  icon?: JSX.Element;
  label: string;
  image?: StaticImageData;
}

const Header = () => {
  const { selectedList, setSelectedList } = useDesignContext();
  const dict = useTranslations("dict.designs.header");

  console.log(selectedList);

  const menus: MenusProps[] = [
    {
      icon: <Icon name='design_2' width={25} height={25} viewBox='0 0 23 25' strokeWidth={1.5} />,
      label: dict("my_designs"),
    },
    {
      icon: <Icon name='diffusion' width={25} height={25} viewBox='0 0 32 35' strokeWidth={1.5} />,
      label: "Hog",
    },
    {
      icon: <Icon name='mail' width={28} height={28} viewBox='0 0 37 30' strokeWidth={2.2} />,
      label: "Email",
    },
    {
      icon: <Icon name='post' width={25} height={25} viewBox='0 0 35 27' strokeWidth={0.5} fillColor='#381D2A' />,
      label: "Post",
    },
    {
      image: uitrade_logo,
      label: dict("more"),
    },
  ];

  const handleMenuClick = (index: number) => {
    console.log("Menu clicked, index:", index); // Log para verificar qué opción se está seleccionando
    if (index !== 4) {
      setSelectedList(index);
    }
  };

  return (
    <div className={styles.header}>
      <Title text={dict("my_designs")} />
      <div className={styles.inner_container}>
        <Search
          handleSearchChange={() => {
            console.log("design");
          }}
          placeholder={dict("search_placeholder")}
          searchValue=''
        />
        <ul className={styles.menus}>
          {menus.slice(0, 4).map((menu, index) => (
            <li
              className={`${styles.menu_item} ${selectedList === index ? styles.selected : ""}`}
              key={index}
              onClick={() => handleMenuClick(index)}
            >
              <div className={styles.menu}>
                {menu.icon && <div className={styles.icon_container}>{menu.icon}</div>}
                {menu.image && <Image src={menu.image.src} width={30} height={30} alt={menu.label} />}
                <p>{menu.label}</p>
              </div>
            </li>
          ))}

          <li className={styles.menu_item}>
            <Link href={"https://uitrade.com"} target='_blank'>
              <div className={styles.menu}>
                <Image src={uitrade_logo.src} width={30} height={30} alt={dict("more")} />
                <p>{dict("more")}</p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
