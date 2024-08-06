import styles from "./styles.module.scss";
import PopupChildren from "@/components/PopupChildren";
import excel from "/public/assets/excel_logo.svg";
import Icon from "@/components/Icon";
import Image from "next/image";
import { getExcelCatalog } from "@/services/fetch";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Button from "@/components/Button";
import DragAndDrop from "@/components/DragAndDrop";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";

interface PopupExcelProps {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  file: File | null;
  setFile: (value: React.SetStateAction<File | null>) => void;
  setFunction: (value: React.SetStateAction<boolean>) => void;
  submitFunction: (event: React.FormEvent) => Promise<void>;
  loading?: boolean;
}

const PopupExcel = ({
  type,
  id,
  title,
  subtitle,
  file,
  setFile,
  setFunction,
  submitFunction,
  loading,
}: PopupExcelProps) => {
  const dict = useTranslations("dict");
  const { dropdownRef } = useCloseDropdown(setFunction);
  const [closing, setClosing] = useState(false);

  const handleExcelDownload = async (type: string) => {
    if (id) await getExcelCatalog(id, type, "getExcelCatalog");
  };

  return (
    <form className={`${styles.form_container} ${closing && styles.closing}`} onSubmit={submitFunction}>
      <div className={styles.inner_container} ref={dropdownRef}>
        <div className={styles.btn_close}>
          <button onClick={() => setClosing(true)} type='button'>
            <Icon name='close' width={30} height={30} strokeColor='#7f7f7f' />
          </button>
        </div>
        <header className={styles.header}>
          <p className={styles.title}>{title}</p>
          <p className={styles.text}>{subtitle}</p>
        </header>
        <div className={styles.btn_template}>
          <Button
            title={dict("catalog.popup_excel.download_template")}
            icon={<Icon name='arrow_download' strokeColor='#7f7f7f' width={25} height={25} viewBox='0 -3 30 30' />}
            styleName='btn_upload'
            onclick={() => handleExcelDownload(type === "upload" ? "template" : "download")}
          />
        </div>
        <DragAndDrop file={file} setFile={setFile} img='Excel' />
        <div className={styles.btn_upload}>
          <Button title={type === "upload" ? "Upload" : "Update"} type='submit' loading={loading} />
        </div>
      </div>
    </form>
  );
};

export default PopupExcel;
