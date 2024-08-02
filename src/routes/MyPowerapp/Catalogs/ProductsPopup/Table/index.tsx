import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";
import Image from "next/image";
import default_image from "/public/assets/default_image.png";

interface Props {
  products: any[];
}

const Table = ({ products }: Props) => {
  const dict = useTranslations("dict.business.my-powerapp");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{dict("name")}</h3>
        <h3>{dict("description")}</h3>
        <h3>{dict("price")}</h3>
      </div>
      <div className={styles.rows_container}>
        {products.length > 0 ? (
          products.map((product, index) => (
            <div className={styles.cell} key={index}>
              <div className={styles.product_name}>
                <Image
                  src={product.data.listimage || default_image}
                  width={50}
                  height={50}
                  alt={product.data.listname}
                />

                {product.data.listname}
              </div>
              <div> {product.data.listdescr}</div>
              <div>${product.data.listprice}</div>
            </div>
          ))
        ) : (
          <p>{dict("empty_products")}</p>
        )}
      </div>
    </div>
  );
};

export default Table;
