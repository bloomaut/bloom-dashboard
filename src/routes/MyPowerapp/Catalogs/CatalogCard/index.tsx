import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

interface Props {
  title: string;
  products: number;
}

const CatalogCard = ({ title, products }: Props) => {
  const dict = useTranslations("dict.business.my-powerapp");

  return (
    <div className={styles.container}>
      <p>
        {title}
        <span>
          ({products} {products === 1 ? dict("product") : dict("products")})
        </span>
      </p>
    </div>
  );
};

export default CatalogCard;
