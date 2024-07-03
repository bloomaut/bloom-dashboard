import styles from "./styles.module.scss";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useState } from "react";
import Icon from "@/components/Icon";

interface PopupVideoProps {
  title: string;
  video: React.ReactElement;
  onClose: () => void;
}

const PopupVideo = ({ title, video, onClose }: PopupVideoProps) => {
  const [closing, setClosing] = useState(false);
  const { dropdownRef } = useCloseDropdown(onClose);
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  return (
    <section className={`${styles.popup_container} ${closing && styles.closing}`}>
      <div className={styles.container} ref={dropdownRef}>
        <div className={styles.head_container}>
          <p>{title}</p>
          <div onClick={handleClose}>
            <Icon name='close' viewBox='0 -5 30 30' />
          </div>
        </div>
        <div className={styles.video}> {video}</div>
      </div>
    </section>
  );
};

export default PopupVideo;
