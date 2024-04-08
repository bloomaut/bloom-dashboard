import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import iconDelete from "../../../public/icons/delete.svg";
import hotlink from "@/../public/icons/hotlink_icon_grey.svg";
import closeIcon from "/public/icons/close.svg";
import Image from "next/image";
import DragAndDrop from "@/components/DragAndDrop";
import { usePathname } from "next/navigation";

interface PopupConfirmProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  onReset?: () => void;
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  title?: string;
  textCancel?: string;
  textAccept?: string;
  dragAndDrop?: boolean;
  file?: File | null;
  setFile?: Dispatch<SetStateAction<File | null>>;
}

const PopupConfirm = ({
  onConfirm,
  onCancel,
  onReset,
  setShowConfirmation,
  title,
  textCancel,
  textAccept,
  dragAndDrop,
  file,
  setFile,
}: PopupConfirmProps) => {
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);
  const pathname = usePathname();

  return (
    <section className={styles.popup_container}>
      <div
        className={dragAndDrop ? `${styles.container} ${styles.drag_container}` : styles.container}
        ref={dropdownRef}
      >
        <p>{title}</p>
        {dragAndDrop && setFile && (
          <>
            <button onClick={onCancel} className={styles.btn_close_icon}>
              <Image src={closeIcon} className={styles.close_icon} alt='close-icon' />
            </button>
            <DragAndDrop file={file} setFile={setFile} />
            {pathname.includes("my-collection") && (
              <div className={styles.button_container}>
                {file !== null && (
                  <button className={styles.no} onClick={onReset}>
                    Resetear
                  </button>
                )}
                <button className={styles.yes} disabled={file === null} onClick={onConfirm}>
                  <Image src={hotlink} alt='hotlink-icon' />
                  Generar Hotlink
                </button>
              </div>
            )}
          </>
        )}
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
