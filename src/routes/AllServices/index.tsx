import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { ENV } from "@/typescript/types/api";
import { get } from "@/services/fetch";
import { useEffect, useState } from "react";
import { DataItemsServiceType } from "@/typescript/interfaces/catalog.interface";
//Components
import LoadingSpinner from "@/components/Loading";
import TableHead from "../CatalogDetailServices/TableHead";
import TableRow from "../CatalogDetailServices/TableRow";
import Breadcrumb from "@/components/Breadcrumb";

const AllServices = () => {
  const [services, setServices] = useState<DataItemsServiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dict = useTranslations("dict.catalog");

  const fetchServices = async () => {
    const data = await get(`dataitem/list/services`, ENV.BOX);
    if (data.statusCode === 200) {
      const sortedItems: DataItemsServiceType[] = [...data.dataItems].sort((a, b) => a.order - b.order);
      setServices(sortedItems);
      setLoading(false);
    }
  };

  const handleDeleteItem = (deletedId: string) => {
    setServices((prevItems: any) => prevItems.filter((item: any) => item._id !== deletedId));
  };

  const handleUpdateItem = (updatedItem: DataItemsServiceType) => {
    setServices(prevItems => prevItems.map(item => (item._id === updatedItem._id ? updatedItem : item)));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className={styles.products_container}>
      <div className={styles.header_container}>
        <Breadcrumb />
        <p>
          {dict("all_services")} ({services?.length})
        </p>
      </div>

      <div className={styles.table_container}>
        <TableHead allServices />
        {loading ? (
          <LoadingSpinner />
        ) : services?.length ? (
          <div className={styles.content_container}>
            {services.map((item: DataItemsServiceType, index: number) => (
              <TableRow
                key={item._id}
                id={item._id}
                position={index + 1}
                catalog={item.dataset?.name}
                allServices={services}
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
                {...item.data}
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

export default AllServices;
