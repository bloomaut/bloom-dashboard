import styles from "./styles.module.scss";
import Card from "./Card";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "@auth0/nextjs-auth0/client";
import Icon from "@/components/Icon";

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
      icon: <Icon name='home' />,
      path: "/",
    },
    {
      title: `${dict("my_business")}`,
      icon: <Icon name='business' viewBox='0 0 32 32' />,
      path: "/my-business",
    },
    ...(user
      ? [
          {
            title: `${dict("gallery")}`,
            icon: <Icon name='design' viewBox='0 0 33 33' />,
            path: "/gallery",
          },
          {
            title: `${dict("hotlink")}`,
            icon: <Icon name='hotlink' className='hotlink_dark' viewBox='1 0 30 34' />,
            path: "/hotlink",
          },
          {
            title: `${dict("catalog")}`,
            icon: <Icon name='catalog' width={25} height={30} viewBox='1 0 35 35' />,
            path: "/catalog",
          },
          {
            title: `${dict("collections")}`,
            icon: <Icon name='collection' />,
            path: "/collections",
          },
          {
            title: `${dict("clients")}`,
            icon: <Icon name='clients' />,
            path: "/clients",
          },
        ]
      : []),
  ];

  return (
    <div className={isOpen ? `${styles.container}` : `${styles.container} ${styles.container_closed}`}>
      <button className={styles.btn} onClick={handleMenu}>
        <Icon name={isOpen ? "double_arrow_left" : "double_arrow_rigth"} />
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
