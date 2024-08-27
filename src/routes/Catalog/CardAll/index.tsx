import styles from "./styles.module.scss";
import Image from "next/image";
import { Link } from "@/navigation";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface CardAllProps {
  dataschema: string;
  name: string;
  image: string | StaticImport;
  totalDataItems: number;
}

const CardAll = ({ name, totalDataItems, dataschema }: CardAllProps) => {
  console.log(name);

  return (
    <article className={styles.container}>
      <div className={dataschema === "uitool-products" ? styles.card : `${styles.card} ${styles.card_services}`}>
        <Link href={dataschema === "uitool-products" ? "all-products" : "all-services"} className={styles.content}>
          <div className={styles.title_container}>
            <h2 className={styles.title} title={name}>
              {name}
            </h2>
            <span>({totalDataItems})</span>
          </div>
        </Link>
      </div>
    </article>
  );
};

export default CardAll;
