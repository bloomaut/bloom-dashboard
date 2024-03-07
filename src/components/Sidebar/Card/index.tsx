import React from "react";
import styles from "./styles.module.scss";
import { Link } from "@/navigation";
import { usePathname } from "next/navigation";

interface CardProps {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const Card = ({ text, path, icon }: CardProps) => {
  const pathname = usePathname();
  const shortPath = pathname.slice(3, pathname.length);
  const isSelected = shortPath === path || (shortPath === "" && path === "/");

  return (
    <Link
      className={
        isSelected
          ? `${styles.container} ${styles.container_selected}`
          : `${styles.container} ${styles.container_noselected}`
      }
      href={path}
    >
      {icon}
      <p className={styles.text}>{text}</p>
    </Link>
  );
};

export default Card;
