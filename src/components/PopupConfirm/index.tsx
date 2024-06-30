import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
// Components
import Button from "../Button";

interface PopupConfirmProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  onReset?: () => void;
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  title?: string;
  textCancel: string;
  textAccept: string;
  dragAndDrop?: boolean;
  file?: File | null;
  setFile?: Dispatch<SetStateAction<File | null>>;
  loading?: boolean;
}

const PopupConfirm = ({
  onConfirm,
  onCancel,
  setShowConfirmation,
  title,
  textCancel,
  textAccept,
  loading,
}: PopupConfirmProps) => {
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);

  return (
    <section className={styles.popup_container}>
      <div className={styles.container} ref={dropdownRef}>
        <p>{title}</p>
        <div className={styles.button_container}>
          <Button title={textCancel} onclick={onCancel} styleName='btn_popup' />
          <Button title={textAccept} onclick={onConfirm} loading={loading} />
        </div>
      </div>
    </section>
  );
};

export default PopupConfirm;
