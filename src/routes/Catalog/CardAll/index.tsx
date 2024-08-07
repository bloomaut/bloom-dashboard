import styles from "./styles.module.scss";
import { Link } from "@/navigation";
import Image from "next/image";

interface CardAllProps {
  dataschema: string;
  name: string;
  image: string;
  totalDataItems: number;
}

const CardAll = ({ name, image, totalDataItems, dataschema }: CardAllProps) => {
  return (
    <article className={styles.container}>
      <div className={dataschema === "uitool-products" ? styles.card : `${styles.card} ${styles.card_services}`}>
        <Link
          href={dataschema === "uitool-products" ? "all-products" : "all-services"}
          className={styles.image_container}
        >
          <Image src={image} className={styles.image} alt={name} width={140} height={140} />
        </Link>
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
