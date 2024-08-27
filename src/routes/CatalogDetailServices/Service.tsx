import { useCatalogServiceContext } from "@/context/CatalogServicesContext";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
// Components
import LoadingSpinner from "@/components/Loading";
import Header from "./Header";
import { DataItemsServiceType } from "@/typescript/interfaces/catalog.interface";
import TableHead from "./TableHead";
import TableRow from "./TableRow";

const Service = () => {
  const { services } = useCatalogServiceContext();
  const [dataItemsCount, setDataItemsCount] = useState<number>(0);
  const [sortedDataItems, setSortedDataItems] = useState<DataItemsServiceType[]>([]);
  const { id } = useParams();
  const dict = useTranslations("dict");

  useEffect(() => {
    if (services && services.dataItems) {
      const sortedItems = [...services.dataItems].sort((a, b) => a.order - b.order);
      setSortedDataItems(sortedItems);
      setDataItemsCount(sortedItems.length);
    }
  }, [services]);

  return (
    <section className={styles.catalog_services_container}>
      <Header name={services?.dataSet.name} quantity={dataItemsCount} id={id} />
      <div className={styles.table_container}>
        <TableHead />
        {!services ? (
          <LoadingSpinner />
        ) : sortedDataItems.length ? (
          <div className={styles.content_container}>
            {sortedDataItems.map((item: DataItemsServiceType, index: number) => (
              <TableRow key={item._id} id={item._id} position={index + 1} {...item.data} />
            ))}
          </div>
        ) : (
          <p className={styles.catalog_empty}>{dict("catalog.empty_service")}</p>
        )}
      </div>
    </section>
  );
};

export default Service;
