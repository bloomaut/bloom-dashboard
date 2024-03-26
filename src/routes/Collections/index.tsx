import styles from "./styles.module.scss";
import { useLocale, useTranslations } from "next-intl";
import Header from "./Header";
import Content from "./Content";

const CollectionsPage = () => {
  const locale = useLocale();
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
        <div className={styles.title}>
          <h2>Nombre</h2>
          <h2 className={styles.border}>Diseño utilizado</h2>
          <h2 className={styles.border}>Receptor</h2>
        </div>
        <div className={styles.subtitle}>
          <div className={styles.subtitle_one}>
            <p>Fecha</p>
          </div>
          <div className={styles.subtitle_two}>
            <p>Nombre del Skin</p>
            <p>Plantilla</p>
          </div>
          <div className={styles.subtitle_three}>
            <p>Total</p>
            <p>Abiertos</p>
          </div>
        </div>
        {/* CONTENIDO */}
        <div className={styles.content_container}>
          {contentData.map((content, index) => {
            return <Content key={index} content={content} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default CollectionsPage;
