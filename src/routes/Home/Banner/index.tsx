import Image from "next/image";
// import Button from "@/components/Button";
import styles from "./styles.module.scss";
import banner_home from "/public/assets/home_banner.png";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

const Banner = () => {
  const dict = useTranslations("dict.home.banner");

  return (
    <div className={styles.container}>
      <h3 className={styles.welcome}>{dict("welcome")}</h3>
      <article className={styles.banner}>
        <div className={styles.banner_text}>
          <h1 className={styles.title}>{dict("title")}</h1>
          <p className={styles.paragraph}>{dict("paragraph")}</p>
          <Button href='/' title={dict("btn")} />
        </div>
        <div className={styles.banner_img}>
          <Image src={banner_home} alt='Banner' />
        </div>
      </article>
    </div>
  );
};

export default Banner;
