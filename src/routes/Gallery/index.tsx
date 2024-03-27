import styles from "./styles.module.scss";
import Title from "@/components/Title";
import Image from "next/image";
import Link from "next/link";
import GalleryComponent from "./GalleryComponent";
import { useTranslations } from "next-intl";

const GalleryPage = () => {
  const dict = useTranslations("dict.gallery");

  return (
    <section className={styles.gallery}>
      <div className={styles.head}>
        <Title text={dict("title")} />
        <div className={styles.logo}>
          <p className={styles.logo_text}>{dict("more_designs")}</p>
          <Link href=''>
            <Image src='/assets/logo_uitrade.png' alt='logo' width={130} height={40} priority />
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
