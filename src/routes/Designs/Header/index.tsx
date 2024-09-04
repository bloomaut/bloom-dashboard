import Title from "@/components/Title";
import styles from "./styles.module.scss";
import Search from "@/components/Search";
import Image, { StaticImageData } from "next/image";
import Icon from "@/components/Icon";
import uitrade_logo from "/public/assets/logo_uitrade.svg";

interface MenusProps {
  icon?: JSX.Element;
  label: string;
  image?: StaticImageData;
}

const menus: MenusProps[] = [
  {
    icon: <Icon name='design_2' width={25} height={25} viewBox='0 0 23 25' strokeWidth={1.5} />,
    label: "My designs",
  },
  {
    icon: <Icon name='diffusion' width={25} height={25} viewBox='0 0 30 35' strokeWidth={1.5} />,
    label: "Diffusion",
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
    label: "More",
  },
];

const Header = () => {
  return (
    <div className={styles.header}>
      <Title text='Designs' />
      <div className={styles.inner_container}>
        <Search
          handleSearchChange={() => {
            console.log("asd");
          }}
          placeholder='Search in your designs or in small...'
          searchValue=''
        />
        <div className={styles.menus}>
          {menus.map((menu, index) => (
            <div className={styles.menu_item} key={index}>
              <div className={styles.menu}>
                {menu.icon && <div className={styles.icon_container}>{menu.icon}</div>}
                {menu.image && <Image src={menu.image.src} width={30} height={30} alt={menu.label} />}
                <p>{menu.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
