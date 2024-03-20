import styles from "./styles.module.scss";
import Image from "next/image";
import { useFlakesContext } from "@/context/FlakesContext";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";
//Componentes
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/app/[locale]/(playground)/introduction/loading";

const TemplatesSelector = () => {
  const dict = useTranslations("dict.playground");
  const { flakes, loading, selectedFlakeId, setSelectedFlakeId } = useFlakesContext();

  return (
    <section className={styles.container}>
      <SectionTitle text={dict("template_title")} />
      <div className={styles.flakes}>
        {!loading ? (
          flakes.map((app: Powerapp) => (
            <div className={styles.template_container} key={app._id}>
              <h4 className={styles.title}>{app.skinx.title}</h4>
              <div
                className={`${styles.template} ${selectedFlakeId === app._id ? styles.selected_template : ""}`}
                onClick={() => setSelectedFlakeId(app._id)}
              >
                <div className={styles.sm_card}>
                  <Image src={app.hog_related.thumbnail} alt={app.skinx.title} width={167} height={120} />
                </div>
                <div className={styles.lg_card}>
                  <Image src={app.thumbnail} alt={app.skinx.title} width={137} height={100} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.loader}>
            <Loading />
          </div>
        )}
      </div>
    </section>
  );
};

export default TemplatesSelector;
