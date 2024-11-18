import styles from "./styles.module.scss";
import { Link } from "@/navigation";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface CardAllProps {
  dataschema: string;
  name: string;
  image: string | StaticImport;
  totalDataItems: number;
}

const CardAll = ({ name, totalDataItems, dataschema }: CardAllProps) => {
  return (
    <article className={(dataschema === "uitool-products" || dataschema === "uitool-store") ? styles.card : `${styles.card} ${styles.card_services}`}>
      <Link
        href={(dataschema === "uitool-products" || dataschema === "uitool-store") ? "all-products" : "all-services"}
        className={styles.title_container}
      >
        <h2 className={styles.title} title={name}>
          {name}
        </h2>
        <span>({totalDataItems})</span>
      </Link>
    </article>
  );
};

export default CardAll;
