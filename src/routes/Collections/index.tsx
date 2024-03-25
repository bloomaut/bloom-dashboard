import Title from "@/components/Title";
import styles from "./styles.module.scss";
import down from "@/../public/icons/IconDown.svg";
import bar from "@/../public/icons/bar.svg";
import period from "@/../public/icons/period.svg";
import plus from "@/../public/icons/plus.svg";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

const CollectionsPage = () => {
  const locale = useLocale();
  const dict = useTranslations("dict.collections");

  return (
    <section className={styles.container}>
      <Title text={dict("title")} />
      <div className={styles.inputs_container}>
        <div className={styles.search_container}>
          <input type='search' placeholder={dict("search")} className={styles.search} />
          <div className={styles.search_icon} />
        </div>
        <div className={styles.period_container}>
          <button className={styles.period}>
            {dict("period_btn")}
            <Image src={down} alt='' />
          </button>

          <div className={styles.period}>
            <Image src={bar} alt='' />
            <Image src={period} alt='' />
          </div>
        </div>
        <Link href={`/${locale}/`} className={styles.new_btn}>
          <Image src={plus} alt='' width={15} height={15} />
          {dict("new_btn")}
        </Link>
      </div>
      <div>tabla</div>
    </section>
  );
};

export default CollectionsPage;
