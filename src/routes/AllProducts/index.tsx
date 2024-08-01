import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { ENV } from "@/typescript/types/api";
import { get } from "@/services/fetch";
import { useEffect, useState } from "react";
//Components
import LoadingSpinner from "@/components/Loading";
import TableHead from "../CatalogDetail/TableHead";
import TableRow from "../CatalogDetail/TableRow";
import Breadcrumb from "@/components/Breadcrumb";
import { AllProducts as AllProductsInterface } from "@/typescript/interfaces/catalog.interface";

const AllProducts = () => {
  const [products, setProducts] = useState<AllProductsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dict = useTranslations("dict.catalog");

  const fetchProducts = async () => {
    const data = await get(`dataitem/list/all`, ENV.BOX);
    if (data.statusCode === 200) {
      const sortedItems: AllProductsInterface[] = [...data.dataItems].sort((a, b) => a.order - b.order);
      setProducts(sortedItems);
      setLoading(false);
    }
  };

  const handleDeleteItem = (deletedId: string) => {
    setProducts((prevItems: any) => prevItems.filter((item: any) => item._id !== deletedId));
  };

  const handleUpdateItem = (updatedItem: AllProductsInterface) => {
    setProducts(prevItems => prevItems.map(item => (item._id === updatedItem._id ? updatedItem : item)));
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
        {loading ? (
          <LoadingSpinner />
        ) : products?.length ? (
          <div className={styles.content_container}>
            {products.map((item: any) => (
              <TableRow
                key={item._id}
                id={item._id}
                name={item.data.listname}
                description={item.data.listdescr}
                price={item.data.listprice}
                image={item.data.listimage}
                position={item.order}
                allProducts={products}
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
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
