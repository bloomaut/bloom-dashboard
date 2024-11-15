import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";

interface SetupProps {
  value: number;
}

const Setup = ({ value = 0 }: SetupProps) => {
  const dict = useTranslations("dict.sidebar");
  const progressWidth = `${(value / 3) * 100}%`;

  return (
    <button className={styles.setup_container} onClick={() => null}>
      <div className={styles.inner_container}>
        <h3 className={styles.title}>{dict("setup.title")}</h3>
        <div className={styles.bar_container}>
          <span className={styles.bar} style={{ width: progressWidth }}></span>
        </div>
        <p className={styles.step}>{`${value}/3 ${dict("setup.completed")}`}</p>
      </div>
    </button>
  );
};

export default Setup;
