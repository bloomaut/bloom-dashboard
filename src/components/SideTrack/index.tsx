import { useTranslations } from "next-intl";
import ItemTrack from "./ItemTrack";
import styles from "./styles.module.scss";

const SideTrack = () => {
  const dict = useTranslations("dict.sidetrack");
  const data = [
    {
      position: 1,
      title: `${dict("step_1")}`,
      iconName: "business_info",
      iconW: 22,
      iconH: 22,
      isActive: true,
    },
    {
      position: 2,
      title: `${dict("step_2")}`,
      isActive: false,
      iconName: "select_template",
      iconW: 20,
      iconH: 19,
    },
    {
      position: 3,
      title: `${dict("step_3")}`,
      isActive: false,
      iconName: "select_catalog",
      iconW: 20,
      iconH: 20,
    },
    {
      position: 4,
      title: `${dict("step_4")}`,
      isActive: false,
      iconName: "generate_powerapp",
      iconW: 22,
      iconH: 12,
    },
  ];
  const subtitle = data.find(i => i.isActive === true);

  return (
    <section className={styles.sidetrack_container}>
      <div className={styles.title_container}>
        <h2 className={styles.title}>
          {dict("title")} {subtitle?.position || ""}
        </h2>
        <p className={styles.description}>{subtitle?.title || ""}</p>
      </div>
      <div className={styles.steps_container}>
        {data.map(btn => {
          return (
            <ItemTrack
              key={btn.title}
              title={btn.title}
              iconH={btn.iconH}
              iconW={btn.iconW}
              iconName={btn.iconName}
              isActive={btn.isActive}
            />
          );
        })}
      </div>
    </section>
  );
};

export default SideTrack;
