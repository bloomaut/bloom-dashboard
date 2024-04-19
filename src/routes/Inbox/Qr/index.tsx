import Image from "next/image";
import styles from "./styles.module.scss";
import qr from "@/../public/assets/inbox_big_qr.png";
import closeIcon from "/public/icons/close.svg";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";

interface QrModalProps {
  setShowPopup: (value: boolean) => void;
}

const QrModal = ({ setShowPopup }: QrModalProps) => {
  const { dropdownRef } = useCloseDropdown(setShowPopup);

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <section className={styles.container}>
      <div ref={dropdownRef} className={styles.inner_container}>
        <button className={styles.btn_close} onClick={handleCancel}>
          <Image src={closeIcon} className={styles.icon} alt='close-icon' />
        </button>
        <div className={styles.content}>
          <Image src={qr} alt='Qr code' width={400} height={400} />
        </div>
      </div>
    </section>
  );
};

export default QrModal;
