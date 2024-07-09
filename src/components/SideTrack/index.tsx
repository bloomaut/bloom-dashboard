import ItemTrack from "./ItemTrack";
import styles from "./styles.module.scss";

const data = [
  {
    title: "Business information",
    iconName: "business_info",
    iconW: 22,
    iconH: 22,
    isActive: true,
  },
  {
    title: "Select template",
    isActive: false,
    iconName: "select_template",
    iconW: 20,
    iconH: 19,
  },
  {
    title: "Catalog",
    isActive: false,
    iconName: "select_catalog",
    iconW: 20,
    iconH: 20,
  },
  {
    title: "Generate PowerApp",
    isActive: false,
    iconName: "generate_powerapp",
    iconW: 22,
    iconH: 12,
  },
];

const SideTrack = () => {
  return (
    <section className={styles.sidetrack_container}>
      <div className={styles.title_container}>
        <h2 className={styles.title}>Step 3</h2>
        <p className={styles.description}>SideTrack</p>
      </div>
      <div className={styles.steps_container}>
        {data.map(btn => {
          return (
            <ItemTrack
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
