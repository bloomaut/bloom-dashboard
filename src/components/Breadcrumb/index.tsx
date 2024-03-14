import styles from "./styles.module.scss";
import Image from "next/image";
import ArrowIcon from "/public/icons/arrow_left.svg";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

interface BreadcrumbProps {
  title: string;
  route: string;
}

const Breadcrumb = ({ title, route }: BreadcrumbProps) => {
  const locale = useLocale();
  const uppercaseRoute = route.toUpperCase();
  const dict = useTranslations("dict.breadcrumb");

  return (
    <ul className={styles.container}>
      <li className={styles.title}>{title}</li>
      <li>
        <Link href={`/${locale}/${route}`} className={styles.link}>
          <Image src={ArrowIcon} alt='arrow' className={styles.arrow} width={15} height={20} />
          <p className={styles.text}>{`${dict("breadcrumb_link")} ${uppercaseRoute}`}</p>
        </Link>
      </li>
    </ul>
  );
};

export default Breadcrumb;
