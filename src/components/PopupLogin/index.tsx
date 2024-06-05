import styles from "./styles.module.scss";
import Link from "next/link";
import Icon from "../Icon";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface PopupLoginProps {
  currentPage: string;
}

const PopupLogin = ({ currentPage }: PopupLoginProps) => {
  const dict = useTranslations("dict.popupLogin");
  const router = useRouter();

  return (
    <section className={styles.container}>
      <div className={styles.inner_container}>
        <button className={styles.btn_back} onClick={() => router.back()}>
          <Icon name='arrow_left' strokeColor='#7f7f7f' viewBox='0 0 28 15' />
          <p className={styles.text}>{dict("link")}</p>
        </button>
        <div className={styles.content}>
          <h2 className={styles.title}>{dict("title")}</h2>
          <Link href={"/api/auth/login?returnTo=" + currentPage} className={styles.btn}>
            <p>{dict("login")}</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopupLogin;
