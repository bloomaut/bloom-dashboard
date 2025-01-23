"use client";
import styles from "./styles.module.scss";
import { useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useTranslations } from "next-intl";
import { useUser } from "@auth0/nextjs-auth0/client";
import Icon from "@/components/Icon";

const UserDrop = () => {
  const dict = useTranslations("dict.navbar");
  const [open, setOpen] = useState<boolean>(false);
  const { dropdownRef } = useCloseDropdown(setOpen);
  const { user } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("client_id");
    setTimeout(() => {
      if (window) {
        window.location.href = "/api/auth/logout";
      }
    }, 0);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <Icon name='user' width={25} height={25} strokeWidth={0.1} fillColor='#381d2a' viewBox='0 0 27 25' />
      <p className={styles.user_name} onClick={() => setOpen(!open)}>
        {user?.nickname}
        <Icon name={open ? "arrow_up" : "arrow_down"} fillColor='#381d2a' strokeColor='#381d2a' viewBox='0 0 25 23' />
      </p>
      <div className={`${styles.list_container} ${!open && styles.list_hidden}`}>
        <ul>
          <li>
            <a onClick={handleLogout}>{dict("logout")}</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDrop;
