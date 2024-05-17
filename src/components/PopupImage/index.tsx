import Image from "next/image";
import styles from "./styles.module.scss";
import closeIcon from "/public/icons/close-white.png";
import { useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";

interface PopupImageProps {
  image: { url?: string; type: string };
  onClose: () => void;
}

const PopupImage = ({ image, onClose }: PopupImageProps) => {
  const [closing, setClosing] = useState(false);
  const { dropdownRef } = useCloseDropdown(onClose);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`${styles.popup_container} ${closing && styles.closing}`}>
      <div className={styles.container} ref={dropdownRef}>
        <div className={styles.btn_container}>
          <button className={styles.btn} onClick={handleClose}>
            <Image src={closeIcon} alt='Close' width={40} height={40} />
          </button>
        </div>
        <div className={styles.image_container}>
          {image.url && (
            <Image src={image.url} className={styles.image} priority alt='Image' width={800} height={800} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupImage;
