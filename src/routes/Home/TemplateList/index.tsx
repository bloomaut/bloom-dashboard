"use client";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useFlakeData } from "@/hooks/useFlakesUser";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
// Components
import Title from "@/components/Title";
import FlakeGallery from "@/routes/Home/TemplateList/FlakeGallery";
import LoadingSpinner from "@/components/Loading";

const Templates = () => {
  const dict = useTranslations("dict.home");
  const { flakes, loading } = useFlakeData();

  return (
    <div className={styles.container}>
      <div className={styles.title_container}>
        <Title text={dict("templates")} />
      </div>
      <div className={styles.flakes_container}>
        {loading ? (
          <LoadingSpinner />
        ) : flakes.length > 0 ? (
          flakes?.map((app: Powerapp) => <FlakeGallery key={app._id} app={app} />)
        ) : (
          <p>{dict("empty_templates")}</p>
        )}
      </div>
    </div>
  );
};

export default Templates;
