import styles from "./styles.module.scss";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";

interface PopupShareProps {
  setShowPopup: (value: boolean) => void;
}

const PopupShare = ({ setShowPopup }: PopupShareProps) => {
  const { dropdownRef } = useCloseDropdown(setShowPopup);

  return (
    <section className={styles.container}>
      <div className={styles.inner_container} ref={dropdownRef}>
        <div className={styles.preview}></div>
        <div className={styles.content}></div>
      </div>
    </section>
  );
};

export default PopupShare;
