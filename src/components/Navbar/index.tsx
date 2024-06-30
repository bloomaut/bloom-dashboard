"use client";
import styles from "./styles.module.scss";
import Image from "next/image";
import { Link } from "@/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useTranslations } from "next-intl";
import { Oval } from "react-loader-spinner";

//Icons
import small from "@/../public/assets/logo_small_color.png";

//Components
import LangDrop from "./LangDrop";
import UserDrop from "./UserDrop";
import LinkComponent from "../LinkComponent";
import { Dropdown } from "./Suite/dropdown";

const Navbar = () => {
  const { user, isLoading } = useUser();
  const dict = useTranslations("dict.login");

  return (
    <nav className={styles.container}>
      <div className={styles.logo_container}>
        <Link href='/'>
          <Image src={small} alt='Small' className={styles.logo} width={300} height={300} priority />
        </Link>
        <Dropdown app='uitrade' />
      </div>
      <div className={styles.inner_container}>
        {/* Language Dropdown */}
        {user ? <LangDrop /> : <></>}
        {/* User | Login */}
        {!isLoading ? (
          <>{user ? <UserDrop /> : <LinkComponent href='/api/auth/login' title={dict("register")} />}</>
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
