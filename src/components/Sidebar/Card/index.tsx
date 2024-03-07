import styles from "./styles.module.scss";
import { Link } from "@/navigation";
import { usePathname } from "next/navigation";

interface CardProps {
  text: string;
  path: string;
  icon: any;
}

const Card = ({ text, path, icon }: CardProps) => {
  const pathname = usePathname();
  let shortPath = pathname.slice(3, pathname.length);

  console.log(shortPath);

  return (
    <Link
      className={
        shortPath === path
          ? ` ${styles.container} ${styles.container_selected}`
          : ` ${styles.container} ${styles.container_noselected}`
      }
      href={path}
    >
      {icon}
      <p className={styles.text}>{text}</p>
    </Link>
  );
};

export default Card;
