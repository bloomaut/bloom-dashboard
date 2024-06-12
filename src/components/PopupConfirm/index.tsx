import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { usePathname } from "next/navigation";
// Components
import DragAndDrop from "@/components/DragAndDrop";
import Icon from "../Icon";
import Button from "../Button";

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
  loading?: boolean;
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
  loading,
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
            <Button title={textCancel} onclick={onCancel} styleName='btn_cancel' />
            <Button title={textAccept} onclick={onConfirm} loading={loading} />
          </div>
        )}
      </div>
    </section>
  );
};

export default PopupConfirm;
