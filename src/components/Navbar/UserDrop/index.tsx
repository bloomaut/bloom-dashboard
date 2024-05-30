"use client";
import styles from "./styles.module.scss";
import Image from "next/image";
import { useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useTranslations } from "next-intl";
import { useUser } from "@auth0/nextjs-auth0/client";
import Icon from "@/components/Icon";
import iconArrow from "@/../public/icons/IconArrowBottom.svg";

const UserDrop = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { dropdownRef } = useCloseDropdown(setOpen);
  const dict = useTranslations("dict.navbar");
  const { user } = useUser();

  return (
    <div className={styles.container} ref={dropdownRef}>
      <Icon name='user' strokeColor='#fff' strokeWidth={0.1} fillColor='#fff' viewBox='0 0 27 27' />
      <p className={styles.user_name} onClick={() => setOpen(!open)}>
        {user?.nickname}
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
