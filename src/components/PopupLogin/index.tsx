import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "/public/icons/arrow_left.svg";
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
          <Image src={ArrowIcon} alt='arrow' className={styles.arrow} width={15} height={20} />
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
