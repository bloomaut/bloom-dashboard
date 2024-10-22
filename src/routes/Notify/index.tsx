"use client";
import styles from "./styles.module.scss";
import Title from "@/components/Title";
import UserInfo from "./UserInfo";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { useDebouncedCallback } from "use-debounce";
import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import LoadingSpinner from "@/components/Loading";
import { formatTime } from "@/utils/formatTime";
import { INotify } from "@/typescript/interfaces/notify.interface";

const Notify = () => {
  const dict = useTranslations("dict.notifications");
  const [notifications, setNotifications] = useState<INotify[]>([]);
  const [notificationSelected, setNotificationSelected] = useState<INotify>();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true);
        const response = await get("notifications", ENV.BOX);
        if (response.statusCode === 200) {
          setNotifications(response.result.notifications || []);
          setNotificationSelected(response.result.notifications[0]);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, []);

  const handleNotificationSelected = (notify: INotify) => {
    setNotificationSelected(notify);
  };

  const handlePageChange = useDebouncedCallback((page: number) => {
    setCurrentPage(page);
  }, 300);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className={styles.notify_container}>
      <Title text={dict("title")} />
      <div className={styles.inner_container}>
        {loading ? (
          <LoadingSpinner />
        ) : notifications.length === 0 ? (
          <p className={styles.no_notifications}>{dict("no_notifications")}</p>
        ) : (
          <>
            <div className={styles.notification}>
              {currentNotifications.map((notification: any) => (
                <div
                  className={`${styles.card} ${notificationSelected?._id === notification._id && styles.selected}`}
                  onClick={() => handleNotificationSelected(notification)}
                  key={notification._id}
                >
                  <h4 className={styles.title}>{notification.title}</h4>
                  <p className={styles.description}>{notification.message}</p>
                  <UserInfo name={notification.title} hour={formatTime(notification.created_at)} />
                </div>
              ))}
              {notifications.length > itemsPerPage && (
                <Pagination totalItems={notifications.length} limit={itemsPerPage} onPageChange={handlePageChange} />
              )}
            </div>
            <div className={styles.notification_detail}>
              {notificationSelected ? (
                <>
                  <h3 className={styles.title}>{notificationSelected.title}</h3>
                  <span>Hello {notificationSelected.title}</span>
                  <p className={styles.description}>{notificationSelected.message}</p>
                  <UserInfo name={notificationSelected.title} hour={formatTime(notificationSelected.created_at)} />
                </>
              ) : (
                <p className={styles.no_notification_selected}>{dict("no_notification_selected")}</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Notify;
