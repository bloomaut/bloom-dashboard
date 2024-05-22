import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
// Components
import Title from "@/components/Title";
import GalleryComponent from "./GalleryComponent";

const GalleryPage = () => {
  const dict = useTranslations("dict.gallery");

  return (
    <section className={styles.gallery}>
      <div className={styles.head}>
        <Title text={dict("title")} />
        <div className={styles.logo}>
          <p className={styles.logo_text}>{dict("more_designs")}</p>
          <Link href='https://uitrade.com/'>
            <Image src='/assets/logo_uitrade.png' alt='logo UiTrade' width={130} height={40} priority />
          </Link>
        </div>
      </div>
      <div className={styles.inner_container}>
        <GalleryComponent />
      </div>
    </section>
  );
};

export default GalleryPage;
