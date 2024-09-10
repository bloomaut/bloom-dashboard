import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname } from "next/navigation";
import Icon from "../Icon";

interface BreadcrumbProps {
  title?: string;
}

const Breadcrumb = ({ title }: BreadcrumbProps) => {
  const router = useRouter();
  const { user } = useUser();
  const pathname = usePathname();

  const handleBack = () => {
    if (user && (pathname.includes("my-business") || pathname.includes("playground"))) {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.btn} onClick={handleBack}>
        <Icon name='arrow_left' width={30} height={30} viewBox='0 0 22 17' />
      </button>
      <p className={styles.title}>{title}</p>
    </div>
  );
};

export default Breadcrumb;
