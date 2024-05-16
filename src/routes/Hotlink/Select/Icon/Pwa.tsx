import styles from "./styles.module.scss";
import Pwa_Icon from "@/../public/icons/pwa_icon.svg";
import Image from "next/image";

const PwaIcon = () => (
  <div className={styles.pwa_icon}>
    <Image src={Pwa_Icon} alt='' />
  </div>
);

export default PwaIcon;
