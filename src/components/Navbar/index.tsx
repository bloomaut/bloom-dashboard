"use client";
import styles from "./styles.module.scss";
import Image from "next/image";
import { Link } from "@/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useTranslations } from "next-intl";

//Icons
import small from "@/../public/assets/Small.png";
import logo_knowledge from "@/../public/icons/KnowledgeIcon.png";

//Components
import LangDrop from "./LangDrop";
import UserDrop from "./UserDrop";
import { Dropdown } from "./Suite/dropdown";
import LinkComponent from "../LinkComponent";

const Navbar = () => {
  const { user } = useUser();
  const dict = useTranslations("dict.navbar");

  return (
    <nav className={styles.container}>
      <Link href='/'>
        <Image src={small} alt='Small' className={styles.logo} width={103} height={47} priority />
      </Link>
      <div className={styles.inner_container}>
        {/* Knowledge */}
        <Link href='https://noti-knowledge.vercel.app/es/' target='_blank'>
          <div className={styles.knowledge}>
            <Image src={logo_knowledge} alt='Logo' priority width={20} height={20} className={styles.logo_knowledge} />
            <p className={styles.text_knowledge}>Knowledge</p>
          </div>
        </Link>
        {/* Language Dropdown */}
        <LangDrop />
        {/* Suite */}
        <Dropdown app='uitrade' />
        {/* User | Login */}
        {user ? <UserDrop /> : <LinkComponent href='/api/auth/login' title={dict("login")} />}
      </div>
    </nav>
  );
};

export default Navbar;
