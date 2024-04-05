import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import iconDelete from "../../../public/icons/delete.svg";
import Image from "next/image";
import FileDragDrop from "@/routes/Business/Files/FileDragDrop";

interface PopupConfirmProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  title: string;
  textCancel?: string;
  textAccept?: string;
  dragAndDrop?: boolean;
  setFile?: Dispatch<SetStateAction<File | null>>;
}

const PopupConfirm = ({
  onConfirm,
  onCancel,
  setShowConfirmation,
  title,
  textCancel,
  textAccept,
  dragAndDrop,
  setFile,
}: PopupConfirmProps) => {
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);

  return (
    <section className={styles.popup_container}>
      <div
        className={dragAndDrop ? `${styles.container} ${styles.drag_container}` : styles.container}
        ref={dropdownRef}
      >
        <p>{title}</p>
        {dragAndDrop && setFile && <FileDragDrop setFile={setFile} />}
        {textCancel && textAccept && (
          <div className={styles.button_container}>
            <button className={styles.no} onClick={onConfirm}>
              {!dragAndDrop && <Image src={iconDelete} alt='delete' className={styles.icon} />}
              {textAccept}
            </button>
            <button className={styles.yes} onClick={onCancel}>
              {textCancel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopupConfirm;
