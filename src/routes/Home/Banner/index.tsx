import styles from "./styles.module.scss";
import Image from "next/image";
import banner_home from "/public/assets/home_banner.png";
import { useLocale, useTranslations } from "next-intl";
//Componentes
import LinkComponent from "@/components/LinkComponent";
import Title from "@/components/Title";
import { Fade } from "react-awesome-reveal";

const Banner = () => {
  const locale = useLocale();
  const dict = useTranslations("dict.home.banner");

  return (
    <Fade>
      <div className={styles.container}>
        <h3 className={styles.welcome}>{dict("welcome")}</h3>
        <article className={styles.banner}>
          <div className={styles.banner_text}>
            <Title text={dict("title")} />
            <p className={styles.paragraph}>{dict("paragraph")}</p>
            <LinkComponent href={`${locale}/playground`} title={dict("btn")} />
          </div>
          <div className={styles.banner_img}>
            <Image src={banner_home} alt='Banner' />
          </div>
        </article>
      </div>
    </Fade>
  );
};

export default Banner;
