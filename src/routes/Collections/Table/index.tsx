"use client";
import styles from "./styles.module.scss";
import { useLocale, useTranslations } from "next-intl";
import { useCollectionsContext } from "@/context/CollectionsContext";
import { useRouter } from "next/navigation";
import { Fade } from "react-awesome-reveal";
// Components
import Button from "@/components/Button";
import TableHead from "../TableHead";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import Icon from "@/components/Icon";
import TableRow from "../TableRow";

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
          ) : (filteredCollections && filteredCollections.length === 0) ||
            (collectionsList && collectionsList.length === 0) ? (
            <p className={styles.text}>{dict("header.empty_collections")}</p>
          ) : filteredCollections ? (
            <Fade cascade damping={0.3} triggerOnce>
              {filteredCollections.map(collection => (
                <TableRow key={collection._id} collection={collection} />
              ))}
            </Fade>
          ) : (
            <Fade cascade damping={0.1} triggerOnce>
              {collectionsList.map(collection => (
                <TableRow key={collection._id} collection={collection} />
              ))}
            </Fade>
          )}
        </div>
      </div>
      {filteredCollections?.length ||
        (collectionsList && (
          <Button
            title={dict("btn")}
            icon={<Icon name='hotlink' className={!id ? "hotlink_grey" : "hotlink_color"} viewBox='0 0 30 32' />}
            isDisabled={!id}
            onclick={handleButton}
            styleName='btn_collections'
          />
        ))}
    </>
  );
};

export default Table;
