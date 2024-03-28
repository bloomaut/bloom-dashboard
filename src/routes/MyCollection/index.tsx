"use client";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
// Components
import Breadcrumb from "@/components/Breadcrumb";
import Header from "./Header";
import Table from "./Table";

const MyCollectionPage = () => {
  const dict = useTranslations("dict.my-collection");

  return (
    <section className={styles.container}>
      <div className={styles.breadcrumb_container}>
        <Breadcrumb title={dict("breadcrumb")} />
      </div>
      <div className={styles.inner_container}>
        <Header />
        <Table />
      </div>
    </section>
  );
};

export default MyCollectionPage;
