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
import SuiteComponent from "./SuiteComponent";
import Icon from "../Icon";
import Button from "../Button";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";

const Navbar = () => {
  const { user, isLoading } = useUser();
  const dict = useTranslations("dict.login");
  const state = useAppSelector(state => state.userData);
  const [openDrop, setOpenDrop] = useState(false);
  const { dropdownRef } = useCloseDropdown(setOpenDrop);

  const handleOpenDrop = () => {
    setOpenDrop(!openDrop);
  };

  return (
    <nav className={styles.container}>
      <div className={styles.logo_container}>
        <Link href='/'>
          <Image src={small} alt='Small' className={styles.logo} width={300} height={300} priority />
        </Link>
        <div className={styles.role_container} onClick={handleOpenDrop}>
          <Icon name='users' viewBox='0 0 25 20' strokeColor='#381d2a' width={25} />
          <Icon name='arrow_down_chevron' viewBox='-5 0 25 1' strokeColor='#381d2a' />
          <div className={`${styles.dropdown} ${openDrop ? styles.showdrop : ""}`} ref={dropdownRef}>
            <p className={styles.title}>{dict("role.title")}</p>
            <div className={styles.roles}>
              <div className={styles.role} onClick={() => alert("holi")}>
                {dict("role.mentor")}{" "}
                <Icon name='arrow_down_chevron' height={20} viewBox='-5 0 25 1' strokeColor='#381d2a' />
              </div>
              <div className={styles.role}>
                {dict("role.breadmaster")}{" "}
                <Icon name='arrow_down_chevron' height={20} viewBox='-5 0 25 1' strokeColor='#381d2a' />
              </div>
              <div className={styles.role}>
                {dict("role.trade")}{" "}
                <Icon name='arrow_down_chevron' height={20} viewBox='-5 0 25 1' strokeColor='#381d2a' />
              </div>
              <Button title={dict("role.button")} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.inner_container}>
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
