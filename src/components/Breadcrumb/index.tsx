import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import Icon from "../Icon";

interface BreadcrumbProps {
  title: string;
}

const Breadcrumb = ({ title }: BreadcrumbProps) => {
  const router = useRouter();
  const { user } = useUser();
  const pathname = usePathname();
  const dict = useTranslations("dict.breadcrumb");

  const handleBack = () => {
    if (user && (pathname.includes("my-business") || pathname.includes("playground"))) {
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
          <Icon name='arrow_left' viewBox='0 0 22 22' />
          <p className={styles.text}>{dict("breadcrumb_link")}</p>
        </button>
      </li>
    </ul>
  );
};

export default Breadcrumb;
