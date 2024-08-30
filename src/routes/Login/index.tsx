import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";
import small from "@/../public/assets/logo_small_login.png";
import notimation from "@/../public/assets/notimation_logo_black.png";
import LinkComponent from "@/components/LinkComponent";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const Login = () => {
  const dict = useTranslations("dict.login");
  const locale = useLocale();

  return (
    <section>
      <Navbar />
      <div className={styles.login_container}>
        <div className={styles.column_one}>
          <div className={styles.bar}></div>
          <div className={styles.wrapper}>
            <div className={styles.text_container}>
              <p className={locale === "es" ? styles.text_animation_es : styles.text_animation_en}>
                <span className={styles.small}>Small</span> {dict("description_one")}{" "}
              </p>
              <p className={styles.text}>{dict("description_two")}</p>
            </div>
          </div>
        </div>
        <div className={styles.login_info}>
          <div className={styles.logo_container}>
            <Image src={small} alt='Small' className={styles.logo} width={300} height={300} priority />
          </div>
          <div className={styles.login_btn}>
            <LinkComponent href='/api/auth/login' title={dict("login")} />
          </div>
          <div className={styles.account}>
            {dict("account")} <br />
            <p>{dict("signup")}</p>
          </div>
          <div className={styles.notimation}>
            <p>Power by</p>
            <Image src={notimation} alt='Small' className={styles.logo} width={100} height={20} priority />
            <Link href='/policy' className={styles.policy}>
              {dict("policy")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
