import Image from "next/image";
import styles from "./styles.module.scss";
import closeIcon from "/public/icons/close.svg";
import { useState } from "react";

interface PopupImageProps {
  image: { url: string; type: string };
  onClose: () => void;
}

const PopupImage = ({ image, onClose }: PopupImageProps) => {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`${styles.popup_container} ${closing && styles.closing}`}>
      <div className={image.type === "hog" ? styles.container : `${styles.container} ${styles.container_lg}`}>
        <div className={styles.btn_container}>
          <button className={styles.btn} onClick={handleClose}>
            <Image src={closeIcon} alt='Close' />
          </button>
        </div>
        <Image src={image.url} className={styles.image} priority alt='Image' width={800} height={800} />
      </div>
    </div>
  );
};

export default PopupImage;
