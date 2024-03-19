import styles from "./styles.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ArrowIcon from "/public/icons/arrow_left.svg";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface PopupLoginProps {
  currentPage: string;
}

const PopupLogin = ({ currentPage }: PopupLoginProps) => {
  const dict = useTranslations("dict.popupLogin");
  const router = useRouter();
  const locale = useLocale();

  let returnUrl = "";

  if (currentPage === "business") {
    returnUrl = locale === "es" ? encodeURIComponent("/es/my-business") : encodeURIComponent("/en/my-business");
  } else if (currentPage === "design") {
    returnUrl = locale === "es" ? encodeURIComponent("/es/design") : encodeURIComponent("/en/design");
  }

  return (
    <section className={styles.container}>
      <div className={styles.inner_container}>
        <button className={styles.btn_back} onClick={() => router.back()}>
          <Image src={ArrowIcon} alt='arrow' className={styles.arrow} width={15} height={20} />
          <p className={styles.text}>{dict("link")}</p>
        </button>
        <div className={styles.content}>
          <h2 className={styles.title}>{dict("title")}</h2>
          <Link href={"/api/auth/login?returnTo=" + returnUrl} className={styles.btn}>
            <p>{dict("login")}</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopupLogin;
