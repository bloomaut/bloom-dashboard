import styles from "./styles.module.scss";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import { useState } from "react";
import { useFlakesContext } from "@/context/FlakesContext";

interface Context {
  flakes: Powerapp[];
  loading: boolean;
  selectedFlakeId: string;
  setSelectedFlakeId: (id: string) => void;
}

const TemplatesSelector = () => {
  const { flakes, loading, selectedFlakeId } = useFlakesContext() as Context;
  const [flakeId, setFlakeId] = useState(selectedFlakeId);

  const changeFlakeId = (id: string) => {
    setFlakeId(id);
  };

  return (
    <section className={styles.container}>
      <SectionTitle text='Plantillas' />
      <div className={styles.flakes}>
        {!loading ? (
          flakes.map((app: Powerapp) => (
            <div className={styles.template_container} key={app._id}>
              <h4 className={styles.title}>{app.skinx.title}</h4>
              <div
                className={`${styles.template} ${flakeId === app._id ? styles.selected_template : ""}`}
                onClick={() => changeFlakeId(app._id)}
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
