import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { ENV } from "@/typescript/types/api";
//Components
import LoadingSpinner from "@/components/Loading";
import TableHead from "../CatalogDetail/TableHead";
import TableRow from "../CatalogDetail/TableRow";
import Breadcrumb from "@/components/Breadcrumb";
import { get } from "@/services/fetch";
import { useEffect, useState } from "react";

const AllProducts = () => {
  const [products, setProducts] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dict = useTranslations("dict.catalog");

  const fetchProducts = async () => {
    const data = await get(`dataitem/list/all`, ENV.BOX);
    if (data.statusCode === 200) {
      setProducts(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={styles.products_container}>
      <div className={styles.header_container}>
        <Breadcrumb />
        <p>{dict("all_products")} </p>
      </div>

      <div className={styles.table_container}>
        <TableHead />
        {!products ? (
          <LoadingSpinner />
        ) : products?.dataItems.length ? (
          <div className={styles.content_container}>
            {products.dataItems.map((item: any, index: number) => (
              <TableRow
                key={item._id}
                id={item._id}
                name={item.data.listname}
                description={item.data.listdescr}
                price={item.data.listprice}
                image={item.data.listimage}
                position={index + 1}
              />
            ))}
          </div>
        ) : (
          <p className={styles.catalog_empty}>{dict("empty")}</p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
