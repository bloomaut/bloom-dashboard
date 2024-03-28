import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import Image from "next/image";
import skin from "@/../../public/icons/skin.svg";
import { CollectionProps } from "@/typescript/interfaces/collection.interface";
//Componentes
import Header from "./Header";
import Titles from "./Titles";
import Content from "./Content";
import { Link } from "@/navigation";

const CollectionsPage = () => {
  const dict = useTranslations("dict.collections");

  const contentData: CollectionProps[] = [
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
    {
      name: "Colección name",
      date: "##-##-##",
      name_skin: "Nombre del skin",
      template: "Plantilla",
      total: 0,
      open: 0,
    },
  ];

  return (
    <section className={styles.container}>
      <Header />
      <div className={styles.table}>
        <Titles />
        {/* CONTENIDO */}
        <div className={styles.content_container}>
          {contentData.map((content, index) => {
            return <Content key={index} content={content} />;
          })}
        </div>
      </div>
      <Link href='/my-collection' className={styles.btn}>
        <Image src={skin} alt='' />
        {dict("btn")}
      </Link>
    </section>
  );
};

export default CollectionsPage;
