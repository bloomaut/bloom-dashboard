"use client";
import styles from "./styles.module.scss";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useTranslations } from "next-intl";
import { Oval } from "react-loader-spinner";
import { Link } from "@/navigation";
//Icons
//Components
import LangDrop from "./LangDrop";
import UserDrop from "./UserDrop";
import LinkComponent from "../LinkComponent";
import SuiteComponent from "./SuiteComponent";
import RoleComponent from "./RoleComponent";
import Icon from "../Icon";

const Navbar = () => {
  const dict = useTranslations("dict.login");
  const { user, isLoading } = useUser();

  return (
    <nav className={styles.container}>
      <div className={styles.logo_container}>
        <Link href='/'>
          <Image
            src={"/logotipo_horizontal.png"}
            alt='Small'
            className={styles.logo}
            width={300}
            height={300}
            priority
          />
        </Link>
        {user && <RoleComponent />}
      </div>
      <div className={styles.inner_container}>
        {user && (
          <Link href='/notify' className={styles.bell}>
            <Icon name='bell' viewBox='0 0 25 20' strokeColor='#381d2a' />
          </Link>
        )}
        {/* Language Dropdown */}
        <LangDrop />
        <SuiteComponent />
        {/* User | Login */}
        {!isLoading ? (
          <>{user ? <UserDrop /> : <LinkComponent href='/api/auth/login' title={dict("register")} />}</>
        ) : (
          <Oval
            height={25}
            width={50}
            color='var(--color-primary)'
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
