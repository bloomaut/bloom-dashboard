import Card from "./Card";
import styles from "./styles.module.scss";
import DashboardIcon from "./Icons/Dashboard";
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
      icon: <DashboardIcon />,
      path: "/",
    },
    {
      title: `${dict("guide")}`,
      icon: <DashboardIcon />,
      path: "/guide",
    },
    {
      title: `${dict("my_business")}`,
      icon: <DashboardIcon />,
      path: "/my-business",
    },
    {
      title: `${dict("design")}`,
      icon: <DashboardIcon />,
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
