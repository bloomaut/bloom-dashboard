"use client";
import Breadcrumb from "@/components/Breadcrumb";
import styles from "./styles.module.scss";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import TableHead from "./TableHead";
import { Fade } from "react-awesome-reveal";
import TableRow from "./TableRow";
import Title from "@/components/Title";
const rows: any[] = [
  { name: "Name", description: "Description", price: 20 },
  { name: "Name", description: "Description", price: 20 },
  { name: "Name", description: "Description", price: 20 },
  { name: "Name", description: "Description", price: 20 },
  { name: "Name", description: "Description", price: 20 },
  { name: "Name", description: "Description", price: 20 },
];

const CatalogDetail = () => {
  const { id } = useParams();
  const dict = useTranslations("dict.catalog");

  return (
    <section className={styles.catalog_detail_container}>
      <div className={styles.header_container}>
        <Breadcrumb />
        <div className={styles.header}>
          <div className={styles.title_container}>
            <Title text={`${dict("title")}:`} />
            <p>Catalog X</p>
          </div>
          <Button
            title={dict("add_product")}
            styleName='btn_orange'
            icon={<Icon name='add' viewBox='0 0 25 20' strokeColor='#fff' />}
          />
        </div>
      </div>
      <div className={styles.table_container}>
        <TableHead />
        <div className={styles.content_container}>
          <Fade cascade damping={0.3} triggerOnce>
            {rows.map(dataset => {
              return (
                <TableRow
                  name={dataset.name}
                  description={dataset.description}
                  price={dataset.price}
                  image={dataset.image}
                />
              );
            })}
          </Fade>
        </div>
        <div className={styles.buttons}>
          <Button
            title={dict("clean_bot")}
            styleName='btn_clean'
            icon={<Icon name='clean' strokeColor='#7F7F7F' viewBox='0 -4 25 25' />}
          />
          <Button
            title={dict("train_bot")}
            styleName='btn_dataset'
            icon={<Icon name='train' strokeColor='white' viewBox='0 -3 25 25' />}
          />
        </div>
      </div>
    </section>
  );
};

export default CatalogDetail;
