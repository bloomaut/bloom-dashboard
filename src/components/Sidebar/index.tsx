import Card from "./Card";
import styles from "./styles.module.scss";
import HomeIcon from "./Icons/Home";
import DesignIcon from "./Icons/Design";
import GuideIcon from "./Icons/Guide";
import MyBusinessIcon from "./Icons/MyBusiness";
import LogoutIcon from "/public/assets/logout.svg";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface SidebarCard {
  title: string;
  icon: JSX.Element;
  path: string;
}

const Sidebar = () => {
  const dict = useTranslations("dict.sidebar");

  const sidebar: Array<SidebarCard> = [
    {
      title: `${dict("home")}`,
      icon: <HomeIcon />,
      path: "/",
    },
    {
      title: `${dict("guide")}`,
      icon: <GuideIcon />,
      path: "/guide",
    },
    {
      title: `${dict("my_business")}`,
      icon: <MyBusinessIcon />,
      path: "/my-business",
    },
    {
      title: `${dict("design")}`,
      icon: <DesignIcon />,
      path: "/design",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.cards_container}>
        {sidebar.map(card => (
          <Card key={card.title} text={card.title} path={card.path} icon={card.icon} />
        ))}
      </div>
      <a href='/api/auth/logout' className={styles.btn}>
        <Image src={LogoutIcon} className={styles.icon} alt='Logout' />
        Logout
      </a>
    </div>
  );
};

export default Sidebar;
