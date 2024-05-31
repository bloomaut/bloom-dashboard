import styles from "./styles.module.scss";
import Image from "next/image";
import { useFlakesContext } from "@/context/FlakesContext";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";
// Components
import SectionTitle from "@/components/SectionTitle";
import Loading from "@/app/[locale]/(playground)/introduction/loading";
import { Fade } from "react-awesome-reveal";
import Icon from "@/components/Icon";

const TemplatesSelector = () => {
  const dict = useTranslations("dict.playground");
  const { flakes, loading, selectedFlakeId, setSelectedFlakeId } = useFlakesContext();

  return (
    <section className={styles.container}>
      <SectionTitle text={dict("template_title")} />
      <div className={styles.flakes}>
        {!loading ? (
          flakes?.map((app: Powerapp) => (
            <Fade triggerOnce key={app._id}>
              <div className={styles.template_container}>
                <h4 className={styles.title}>{app.skinx.title}</h4>
                <div
                  className={`${styles.template} ${selectedFlakeId === app._id ? styles.selected_template : ""}`}
                  onClick={() => setSelectedFlakeId(app._id)}
                >
                  <div className={styles.sm_card}>
                    {app.hog_related.thumbnail ? (
                      <Image src={app.hog_related.thumbnail} alt={app.skinx.title} width={167} height={120} />
                    ) : (
                      <Icon
                        name='hog'
                        width={40}
                        height={40}
                        fillColor='#7f7f7f'
                        strokeColor='#7f7f7f'
                        strokeWidth={0.5}
                      />
                    )}
                  </div>
                  <div className={styles.lg_card}>
                    {app.thumbnail && <Image src={app.thumbnail} alt={app.skinx.title} width={137} height={100} />}
                  </div>
                </div>
              </div>
            </Fade>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </section>
  );
};

export default TemplatesSelector;
