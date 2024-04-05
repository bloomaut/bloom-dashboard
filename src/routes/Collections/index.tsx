"use client";
import styles from "./styles.module.scss";
import { CollectionsProvider } from "@/context/CollectionsContext";
//Componentes
import Header from "./Header";
import Table from "./Table";

const CollectionsPage = () => {
  return (
    <CollectionsProvider>
      <section className={styles.container}>
        <Header />
        <Table />
      </section>
    </CollectionsProvider>
  );
};

export default CollectionsPage;
