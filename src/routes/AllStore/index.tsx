import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { ENV } from "@/typescript/types/api";
import { get } from "@/services/fetch";
import { useEffect, useState } from "react";
//Components
import LoadingSpinner from "@/components/Loading";
import TableHead from "../CatalogDetailStore/TableHead";
import TableRow from "../CatalogDetailStore/TableRow";
import Breadcrumb from "@/components/Breadcrumb";
import { AllProducts as AllStoreInterface } from "@/typescript/interfaces/catalog.interface";

const AllStore = () => {
  const [products, setProducts] = useState<AllStoreInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dict = useTranslations("dict.catalog");

  const fetchProducts = async () => {
    const data = await get(`dataitem/list/products`, ENV.BOX);
    if (data.statusCode === 200) {
      const sortedItems: AllStoreInterface[] = [...data.dataItems].sort((a, b) => a.order - b.order);
      setProducts(sortedItems);
      setLoading(false);
    }
  };

  const handleDeleteItem = (deletedId: string) => {
    setProducts((prevItems: any) => prevItems.filter((item: any) => item._id !== deletedId));
  };

  const handleUpdateItem = (updatedItem: AllStoreInterface) => {
    setProducts(prevItems => prevItems.map(item => (item._id === updatedItem._id ? updatedItem : item)));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={styles.products_container}>
      <div className={styles.header_container}>
        <Breadcrumb />
        <p>
          {dict("all_products")} ({products?.length})
        </p>
      </div>

      <div className={styles.table_container}>
        <TableHead allProducts={true} />
        {loading ? (
          <LoadingSpinner />
        ) : products?.length ? (
          <div className={styles.content_container}>
            {products.map((item: AllStoreInterface) => (
              <TableRow
                key={item._id}
                id={item._id}
                name={item.data.listname}
                catalog={item.dataset.name}
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

export default AllStore;
