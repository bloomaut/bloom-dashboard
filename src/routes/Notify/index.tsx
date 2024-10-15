"use client";
import styles from "./styles.module.scss";
import Title from "@/components/Title";
import UserInfo from "./UserInfo";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { useDebouncedCallback } from "use-debounce";

const Notify = () => {
  const dict = useTranslations("dict");
  const [notificationSelected, setNotificationSelected] = useState<number>();

  const handleNotificationSelected = (index: number) => {
    setNotificationSelected(index);
  };

  const handlePageChange = useDebouncedCallback(async (page: number = 1) => {
    const startIndex = (page - 1) * 5;
    // getHotlinkList(startIndex, 5);
  }, 500);

  // Cambiar a datos de la API
  return (
    <section className={styles.notify_container}>
      <Title text='Notificación' />
      <div className={styles.inner_container}>
        <div className={styles.notification}>
          <div
            className={`${styles.card} ${notificationSelected === 1 && styles.selected}`}
            onClick={() => handleNotificationSelected(1)}
          >
            <h4 className={styles.title}>Notification title</h4>
            <p className={styles.description}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus nulla earum numquam reprehenderit eum,
              fugit quas culpa magnam explicabo rem?
            </p>
            <UserInfo name='Simon Peres' hour='16:30' />
          </div>
          <div
            className={`${styles.card} ${notificationSelected === 2 && styles.selected}`}
            onClick={() => handleNotificationSelected(2)}
          >
            <h4 className={styles.title}>Notification title</h4>
            <p className={styles.description}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus nulla earum numquam reprehenderit eum,
              fugit quas culpa magnam explicabo rem?
            </p>
            <UserInfo name='Simon Peres' hour='16:30' />
          </div>
          <div className={styles.card}>
            <h4 className={styles.title}>Notification title</h4>
            <p className={styles.description}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus nulla earum numquam reprehenderit eum,
              fugit quas culpa magnam explicabo rem?
            </p>
            <UserInfo name='Simon Peres' hour='16:30' />
          </div>
          <div className={styles.card}>
            <h4 className={styles.title}>Notification title</h4>
            <p className={styles.description}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus nulla earum numquam reprehenderit eum,
              fugit quas culpa magnam explicabo rem?
            </p>
            <UserInfo name='Simon Peres' hour='16:30' />
          </div>
          {5 > 4 && <Pagination totalItems={10} limit={4} onPageChange={handlePageChange} />}
        </div>
        <div className={styles.notification_detail}>
          <h3 className={styles.title}>Notification title</h3>
          <span>Hello Ricardo</span>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus nulla earum numquam reprehenderit eum,
            fugit quas culpa magnam explicabo rem? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            nulla earum numquam reprehenderit eum, fugit quas culpa magnam explicabo rem?
          </p>
          <UserInfo name='Simon Peres' hour='16:30' />
        </div>
      </div>
    </section>
  );
};

export default Notify;
