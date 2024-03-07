import Card from "./Card";
import styles from "./styles.module.scss";
import HomeIcon from "./Icons/Home";
import DesignIcon from "./Icons/Design";
import GuideIcon from "./Icons/Guide";
import MyBusinessIcon from "./Icons/MyBusiness";
import { useTranslations } from "next-intl";

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
      {sidebar.map(card => (
        <Card key={card.title} text={card.title} path={card.path} icon={card.icon} />
      ))}
    </div>
  );
};

export default Sidebar;
