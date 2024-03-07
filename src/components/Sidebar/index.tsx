import Card from "./Card";
import styles from "./styles.module.scss";
import DashboardIcon from "./Icons/Dashboard";

interface SidebarCard {
  title: string;
  icon: JSX.Element;
  path: string;
}

const Sidebar = () => {
  const sidebar: Array<SidebarCard> = [
    {
      title: "Home",
      icon: <DashboardIcon />,
      path: "/",
    },
    {
      title: "Guía",
      icon: <DashboardIcon />,
      path: "/guía",
    },
    {
      title: "Mi Negocio",
      icon: <DashboardIcon />,
      path: "/mi-negocio",
    },
    {
      title: "Diseño",
      icon: <DashboardIcon />,
      path: "/diseño",
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
