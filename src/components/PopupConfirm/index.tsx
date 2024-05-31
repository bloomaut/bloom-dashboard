import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { usePathname } from "next/navigation";
// Components
import DragAndDrop from "@/components/DragAndDrop";
import Icon from "../Icon";

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
              <Icon name='close' width={30} height={30} />
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
                  <Icon
                    name='hotlink'
                    strokeWidth={1}
                    className={file ? "hotlink_dark" : "hotlink_grey"}
                    width={25}
                    height={30}
                    viewBox='0 0 30 34'
                  />
                  Generar Hotlink
                </button>
              </div>
            )}
          </>
        )}
        {textCancel && textAccept && (
          <div className={styles.button_container}>
            <button className={styles.no} onClick={onConfirm}>
              {!dragAndDrop && <Icon name='delete' width={25} height={25} strokeColor='#7f7f7f' viewBox='0 0 25 23' />}
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
