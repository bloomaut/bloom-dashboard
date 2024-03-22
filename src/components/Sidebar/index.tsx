import Card from "./Card";
import styles from "./styles.module.scss";
import HomeIcon from "./Icons/Home";
import DesignIcon from "./Icons/Design";
import GuideIcon from "./Icons/Guide";
import MyBusinessIcon from "./Icons/MyBusiness";
import HotlinkIcon from "./Icons/Hotlink";
import InboxIcon from "./Icons/Inbox";
import CollectionsIcon from "./Icons/Collections";
import ClientsIcon from "./Icons/Clients";
import { useTranslations } from "next-intl";
import { useUser } from "@auth0/nextjs-auth0/client";

interface SidebarCard {
  title: string;
  icon: JSX.Element;
  path: string;
}

const Sidebar = () => {
  const dict = useTranslations("dict.sidebar");
  const { user } = useUser();

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
      title: `${dict("gallery")}`,
      icon: <DesignIcon />,
      path: "/gallery",
    },
    ...(user
      ? [
          {
            title: `${dict("hotlink")}`,
            icon: <HotlinkIcon />,
            path: "/hotlink",
          },
          {
            title: `${dict("inbox")}`,
            icon: <InboxIcon />,
            path: "/inbox",
          },
          {
            title: `${dict("collections")}`,
            icon: <CollectionsIcon />,
            path: "/collections",
          },
          {
            title: `${dict("clients")}`,
            icon: <ClientsIcon />,
            path: "/clients",
          },
        ]
      : []),
  ];

  return (
    <div className={styles.container}>
      <div className={styles.cards_container}>
        {sidebar.map(card => (
          <Card key={card.title} text={card.title} path={card.path} icon={card.icon} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
