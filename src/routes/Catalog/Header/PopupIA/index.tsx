import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { SetStateAction, useState } from "react";
import styles from "./styles.module.scss";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import DragAndDrop from "@/components/DragAndDrop";

interface PopupIAProps {
  title: string;
  subtitle: string;
  text: string;
  file: File | null;
  setFile: (value: SetStateAction<File | null>) => void;
  loading?: boolean;
  onCancel: (value: SetStateAction<boolean>) => void;
  onReset: () => void;
  onConfirm: () => void;
}

const PopupIA = ({ onCancel, onConfirm, onReset, subtitle, text, title, loading, file, setFile }: PopupIAProps) => {
  const [closing, setClosing] = useState(false);
  const { dropdownRef } = useCloseDropdown(onCancel);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onCancel(false);
    }, 300);
  };

  return (
    <div className={`${styles.popup_container} ${closing && styles.closing}`}>
      <div className={styles.container} ref={dropdownRef}>
        <div className={styles.btn_close}>
          <button onClick={handleClose} type='button'>
            <Icon name='close' width={40} height={40} strokeColor='#7f7f7f' />
          </button>
        </div>
        <div className={styles.inner_container}>
          <p className={styles.title}>{title}</p>
          <p className={styles.subtitle}>{subtitle}</p>
          <p className={styles.text}>{text}</p>
          <div className={styles.drag_container}>
            <DragAndDrop type='excel' file={file} setFile={setFile} />
            <div className={styles.btn_container}>
              {file && <Button title='Reset' styleName='btn_reset' onclick={onReset} />}
              <Button title='Upload' styleName='btn_add' onclick={onConfirm} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupIA;
