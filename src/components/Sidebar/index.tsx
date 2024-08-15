"use client";
import styles from "./styles.module.scss";
import Card from "./Card";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import Link from "next/link";
import Setup from "./Setup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCatalogComplete, setUserData } from "@/store/features/userSlice";
import { get } from "@/services/fetch";
import useStepValidation from "@/hooks/useStepValidation";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import { ENV } from "@/typescript/types/api";

interface SidebarCard {
  title: string;
  icon: JSX.Element;
  path: string;
}

const Sidebar = () => {
  const userData = useAppSelector(state => state.userData);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const dict = useTranslations("dict.sidebar");
  const dispatch = useAppDispatch();
  const INBOX_URL = process.env.NEXT_PUBLIC_INBOX_URL;

  const { currentStep, step_04 } = useStepValidation();

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  const sidebar: Array<SidebarCard> = [
    {
      title: `${dict("home")}`,
      icon: <Icon name='home' viewBox='0 0 30 35' />,
      path: "/",
    },
    {
      title: `${dict("my_business")}`,
      icon: <Icon name='business' viewBox='0 0 32 32' />,
      path: "/my-business",
    },

    {
      title: `${dict("hotlink")}`,
      icon: <Icon name='hotlink' viewBox='1 0 25 25' strokeWidth={1.2} />,
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
  ];

  const getUserData = async () => {
    const res = await get("user/me");
    if (res.statusCode === 200) {
      dispatch(setUserData(res.result.user));
    }
    const data = await get("datasets/small/list", ENV.BOX);
    if (data.statusCode === 200) {
      const isComplete = data.data.datasets.some((obj: DatasetProps) => obj.totalDataItems >= 1);
      dispatch(setCatalogComplete(isComplete));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className={`${styles.container} ${!isOpen && styles.container_closed}`}>
      <button className={styles.btn} onClick={handleMenu}>
        <Icon name={isOpen ? "double_arrow_left" : "double_arrow_rigth"} />
      </button>
      {isOpen && userData.id && !step_04 && <Setup value={currentStep} />}
      <div
        className={isOpen ? `${styles.cards_container}` : `${styles.cards_container} ${styles.cards_container_closed}`}
      >
        {sidebar.map(card => (
          <Card key={card.title} text={card.title} path={card.path} icon={card.icon} />
        ))}
      </div>
      <Link href={INBOX_URL!} target='_blank' className={styles.link_container}>
        <Icon name='link' width={20} height={20} viewBox='0 -1 30 30' className='cursor_pointer' />
        {isOpen && <p>{dict("link_inbox")}</p>}
      </Link>
    </div>
  );
};

export default Sidebar;
