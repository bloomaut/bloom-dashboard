"use client";
import styles from "./styles.module.scss";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import skin from "@/../../public/icons/skin.svg";
import { CollectionProps } from "@/typescript/interfaces/collection.interface";
import { Link } from "@/navigation";
import { useCollectionsContext } from "@/context/CollectionsContext";
//Componentes
import Button from "@/components/Button";
import TableHead from "../TableHead";
import TableRows from "../TableRow";
import { useRouter } from "next/navigation";

const Table = () => {
  const { id } = useCollectionsContext();
  const dict = useTranslations("dict.collections");
  const router = useRouter();
  const locale = useLocale();

  const contentData: CollectionProps[] = [
    {
      id: "1",
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      id: "2",
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      id: "3",
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      id: "4",
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      id: "5",
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      id: "6",
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      id: "7",
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      id: "8",
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
  ];

  const handleButton = () => {
    router.push(`/${locale}/my-collection/${id}`);
  };
  return (
    <>
      <div className={styles.table}>
        <TableHead />
        {/* CONTENIDO */}
        <div className={styles.content_container}>
          {contentData.map((content, index) => {
            return <TableRows key={index} content={content} />;
          })}
        </div>
      </div>
      <Button title={dict("btn")} icon={skin} isDisabled={!id} onclick={handleButton} styleName='btn_collections' />
    </>
  );
};

export default Table;
