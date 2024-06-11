import styles from "./styles.module.scss";
import { FormEvent, SetStateAction } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import Button from "../Button";

interface PopupChildrenProps {
  onConfirm: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
  title?: string;
  textCancel: string;
  textAccept: string;
  children: React.ReactNode;
  loading?: boolean;
}

const PopupChildren = ({
  onConfirm,
  onCancel,
  setShowConfirmation,
  title,
  textCancel,
  textAccept,
  children,
  loading,
}: PopupChildrenProps) => {
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);

  return (
    <section className={styles.popup_container}>
      <div className={styles.container} ref={dropdownRef}>
        <p>{title}</p>
        {children}
        <form className={styles.button_container} onSubmit={onConfirm}>
          <Button title={textCancel} onclick={onCancel} styleName='btn_cancel' />
          <Button title={textAccept} type='submit' loading={loading} />
        </form>
      </div>
    </section>
  );
};

export default PopupChildren;
