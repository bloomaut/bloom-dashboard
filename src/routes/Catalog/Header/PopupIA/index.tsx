import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { SetStateAction, useState } from "react";
import styles from "./styles.module.scss";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import DragAndDrop from "@/components/DragAndDrop";
import { Oval } from "react-loader-spinner";
import { useTranslations } from "next-intl";

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
  const dict = useTranslations("dict");

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onCancel(false);
    }, 300);
  };

  return (
    <div className={`${styles.popup_container} ${closing && styles.closing}`}>
      <div className={styles.container} ref={dropdownRef}>
        {loading ? (
          <div className={styles.loading_container}>
            <Oval
              height={55}
              width={55}
              color='#ff5722'
              wrapperStyle={{}}
              wrapperClass=''
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor='#fff'
              strokeWidth={3.5}
              strokeWidthSecondary={3.5}
            />
            <p className={styles.message}>
              <span>GPT</span>
              {dict("popup.excel.loading_msg")}
            </p>
          </div>
        ) : (
          <>
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
                  {file && <Button title={dict("popup.excel.reset")} styleName='btn_reset' onclick={onReset} />}
                  <Button
                    title={dict("popup.excel.upload")}
                    styleName='btn_add'
                    onclick={onConfirm}
                    loading={loading}
                    isDisabled={file ? false : true}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PopupIA;
