"use client";
import styles from "./styles.module.scss";
import skin from "@/../../public/icons/skin.svg";
import { useLocale, useTranslations } from "next-intl";
import { useCollectionsContext } from "@/context/CollectionsContext";
//Componentes
import Button from "@/components/Button";
import TableHead from "../TableHead";
import TableRows from "../TableRow";
import { useRouter } from "next/navigation";
import Loading from "@/app/[locale]/(playground)/introduction/loading";

const Table = () => {
  const { id, collectionsList, filteredCollections, loading } = useCollectionsContext();
  const dict = useTranslations("dict.collections");
  const router = useRouter();
  const locale = useLocale();

  const handleButton = () => {
    router.push(`/${locale}/my-collection/${id}`);
  };

  return (
    <>
      <div className={styles.table}>
        <TableHead />
        {/* CONTENIDO */}
        <div className={styles.content_container}>
          {loading ? (
            <Loading />
          ) : filteredCollections ? (
            <TableRows key={filteredCollections._id} collection={filteredCollections} />
          ) : (
            collectionsList.map(collection => {
              return <TableRows key={collection._id} collection={collection} />;
            })
          )}
        </div>
      </div>
      <Button title={dict("btn")} icon={skin} isDisabled={!id} onclick={handleButton} styleName='btn_collections' />
    </>
  );
};

export default Table;
