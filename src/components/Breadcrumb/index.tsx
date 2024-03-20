import styles from "./styles.module.scss";
import Image from "next/image";
import ArrowIcon from "/public/icons/arrow_left.svg";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface BreadcrumbProps {
  title: string;
}

const Breadcrumb = ({ title }: BreadcrumbProps) => {
  const router = useRouter();
  const { user } = useUser();
  const pathname = usePathname();
  const dict = useTranslations("dict.breadcrumb");

  const handleBack = () => {
    if (user && (pathname.includes("my-business") || pathname.includes("design"))) {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <ul className={styles.container}>
      <li className={styles.title}>{title}</li>
      <li>
        <button className={styles.btn} onClick={handleBack}>
          <Image src={ArrowIcon} alt='arrow' className={styles.arrow} width={15} height={20} />
          <p className={styles.text}>{dict("breadcrumb_link")}</p>
        </button>
      </li>
    </ul>
  );
};

export default Breadcrumb;
