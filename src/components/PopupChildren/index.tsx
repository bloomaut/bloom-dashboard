import styles from "./styles.module.scss";
import { FormEvent, SetStateAction, useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import Button from "../Button";
import { usePathname } from "next/navigation";

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
  const [closing, setClosing] = useState(false);
  const pathname = usePathname();

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  return (
    <section className={`${styles.popup_container} ${closing && styles.closing}`}>
      <div className={styles.container} ref={dropdownRef}>
        <p>{title}</p>
        {children}
        <form className={styles.button_container} onSubmit={onConfirm}>
          <Button title={textCancel} onclick={handleClose} styleName='btn_outline' />
          <Button title={textAccept} type='submit' loading={loading} />
        </form>
      </div>
    </section>
  );
};

export default PopupChildren;
