import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import Image from "next/image";

//Componentes
import Header from "./Header";
import Titles from "./Titles";
import Content from "./Content";

import skin from "@/../../public/icons/skin.svg";

const CollectionsPage = () => {
  const dict = useTranslations("dict.collections");

  const contentData = [
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
      <button className={styles.btn}>
        <Image src={skin} alt='' />
        Ver Colección
      </button>
    </section>
  );
};

export default CollectionsPage;
