import styles from "./styles.module.scss";
import Image from "next/image";
import ArrowIcon from "/public/icons/arrow_left.svg";
import { useRouter } from "next/navigation";

interface BreadcrumbProps {
  title: string;
}

const Breadcrumb = ({ title }: BreadcrumbProps) => {
  const router = useRouter();

  return (
    <ul className={styles.container}>
      <li className={styles.title}>{title}</li>
      <li>
        <button className={styles.btn} onClick={() => router.back()}>
          <Image src={ArrowIcon} alt='arrow' className={styles.arrow} width={15} height={20} />
          <p className={styles.text}>Volver</p>
        </button>
      </li>
    </ul>
  );
};

export default Breadcrumb;
