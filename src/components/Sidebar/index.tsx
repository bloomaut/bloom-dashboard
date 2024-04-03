import { Dispatch, SetStateAction } from "react";
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
import ArrowLeft from "../../../public/icons/double_arrow_left.svg";
import ArrowRigth from "../../../public/icons/double_arrow_rigth.svg";
import { useTranslations } from "next-intl";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

interface SidebarCard {
  title: string;
  icon: JSX.Element;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const dict = useTranslations("dict.sidebar");
  const { user } = useUser();

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

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
    ...(user
      ? [
          {
            title: `${dict("gallery")}`,
            icon: <DesignIcon />,
            path: "/gallery",
          },
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
    <div className={isOpen ? `${styles.container}` : `${styles.container} ${styles.container_closed}`}>
      <button className={styles.btn} onClick={handleMenu}>
        <Image src={isOpen ? ArrowLeft : ArrowRigth} alt='arrow open' />
      </button>
      <div
        className={isOpen ? `${styles.cards_container}` : `${styles.cards_container} ${styles.cards_container_closed}`}
      >
        {sidebar.map(card => (
          <Card key={card.title} text={card.title} path={card.path} icon={card.icon} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
