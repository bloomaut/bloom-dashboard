import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import styles from "./styles.module.scss";
import Image from "next/image";
import flake_icon_02 from "/public/flake_icon_02.svg";
import { useDesignContext } from "@/context/DesignContext";

const PowerappCard = ({ powerApp }: { powerApp: HogRelated }) => {
  const { setTemplateIdSelected, templateIdSelected } = useDesignContext();

  return (
    <section
      className={
        powerApp._id === templateIdSelected
          ? `${styles.powerapp_container} ${styles.powerapp_container_active}`
          : styles.powerapp_container
      }
      onClick={() => setTemplateIdSelected(powerApp._id)}
    >
      <div className={styles.image_wrapper}>
        {powerApp.thumbnail ? (
          <Image src={powerApp.thumbnail} alt='Hog' width={200} height={300} />
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
