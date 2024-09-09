import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import styles from "./styles.module.scss";
import Image from "next/image";
import flake_icon_02 from "/public/flake_icon_02.svg";

interface PowerappCardProp {
  powerApp: HogRelated;
  setPowerAppSelected: (powerApp: string) => void;
  powerAppSelected: string;
}

const PowerappCard = ({ powerApp, setPowerAppSelected, powerAppSelected }: PowerappCardProp) => {
  return (
    <section
      className={
        powerApp._id === powerAppSelected
          ? `${styles.powerapp_container} ${styles.powerapp_container_active}`
          : styles.powerapp_container
      }
      onClick={() => setPowerAppSelected(powerApp._id)}
    >
      <div className={styles.image_wrapper}>
        {powerApp.thumbnail ? (
          <Image src={powerApp.thumbnail} className={styles.thumbnail} alt='Hog' width={200} height={300} />
        ) : (
          <div className={styles.empty_powerapp}>
            <Image src={flake_icon_02} alt='Icon' />
          </div>
        )}
      </div>
      <p className={styles.title}>{powerApp.title}</p>
    </section>
  );
};

export default PowerappCard;
