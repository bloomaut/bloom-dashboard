"use client";

import styles from "./styles.module.scss";
import { useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import Image from "next/image";
import { useTranslations } from "next-intl";

import userLogo from "@/../public/icons/UserLogo.png";
import iconArrow from "@/../public/icons/IconArrowBottom.png";

const UserDrop = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { dropdownRef } = useCloseDropdown(setOpen);
  const dict = useTranslations("dict.navbar");

  return (
    <div className={styles.container} ref={dropdownRef}>
      <Image src={userLogo} alt='User Logo' priority width={25} height={25} className={styles.logo} />
      <p className={styles.user_name} onClick={() => setOpen(!open)}>
        User
        <Image
          src={iconArrow}
          alt='Arrow'
          width={10}
          height={10}
          className={open ? `${styles.arrow} ${styles.arrow_open}` : `${styles.arrow} ${styles.arrow_closed}`}
        />
      </p>
      <div className={`${styles.list_container} ${!open && styles.list_hidden}`}>
        <ul>
          <li>
            <a href='/api/auth/logout'>{dict("logout")}</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDrop;
