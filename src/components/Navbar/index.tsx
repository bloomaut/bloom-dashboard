"use client";
import styles from "./styles.module.scss";
import Image from "next/image";
import { Link } from "@/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useTranslations } from "next-intl";
import { Oval } from "react-loader-spinner";

//Icons
import small from "@/../public/assets/logo_small.png";
import logo_knowledge from "@/../public/icons/KnowledgeIcon.svg";

//Components
import LangDrop from "./LangDrop";
import UserDrop from "./UserDrop";
import { Dropdown } from "./Suite/dropdown";
import LinkComponent from "../LinkComponent";

const Navbar = () => {
  const { user, isLoading } = useUser();
  const dict = useTranslations("dict.navbar");

  return (
    <nav className={styles.container}>
      <Link href='/'>
        <Image src={small} alt='Small' className={styles.logo} width={300} height={300} priority />
      </Link>
      <div className={styles.inner_container}>
        {/* Knowledge */}
        <Link href='https://noti-knowledge.vercel.app/es/' target='_blank'>
          <div className={styles.knowledge}>
            <Image src={logo_knowledge} alt='Logo' className={styles.logo_knowledge} />
            <p className={styles.text_knowledge}>Knowledge</p>
          </div>
        </Link>
        {/* Language Dropdown */}
        <LangDrop />
        {/* Suite */}
        <Dropdown app='uitrade' />
        {/* User | Login */}
        {!isLoading ? (
          <>{user ? <UserDrop /> : <LinkComponent href='/api/auth/login' title={dict("login")} />}</>
        ) : (
          <Oval
            height={25}
            width={50}
            color='#ff3d02'
            visible={true}
            secondaryColor='#ffc8b8'
            strokeWidth={3}
            strokeWidthSecondary={3}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
