import styles from "./styles.module.scss";
import { SetStateAction } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import iconDelete from "../../../public/icons/delete.svg";
import Image from "next/image";

interface PopupConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  title: string;
  textCancel: string;
  textAccept: string;
}

const PopupConfirm = ({
  onConfirm,
  onCancel,
  setShowConfirmation,
  title,
  textCancel,
  textAccept,
}: PopupConfirmProps) => {
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);

  return (
    <section className={styles.popup_container}>
      <div className={styles.container} ref={dropdownRef}>
        <p>{title}</p>
        <div className={styles.button_container}>
          <button className={styles.no} onClick={onConfirm}>
            <Image src={iconDelete} alt='delete' className={styles.icon} />
            {textAccept}
          </button>
          <button className={styles.yes} onClick={onCancel}>
            {textCancel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopupConfirm;
