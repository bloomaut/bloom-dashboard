"use client";
import styles from "./styles.module.scss";
import { useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useTranslations } from "next-intl";
import { useUser } from "@auth0/nextjs-auth0/client";
import Icon from "@/components/Icon";

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
        <Icon name={open ? "arrow_up" : "arrow_down"} fillColor='#fff' strokeColor='#fff' viewBox='0 0 25 23' />
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
