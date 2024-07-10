import styles from "./styles.module.scss";
import PopupChildren from "@/components/PopupChildren";
import excel from "/public/assets/excel_logo.svg";
import Icon from "@/components/Icon";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Button from "@/components/Button";
import DragAndDrop from "@/components/DragAndDrop";

interface Props {
  file: File | null;
  setFile: (value: React.SetStateAction<File | null>) => void;
  setFunction: (value: React.SetStateAction<boolean>) => void;
  submitFunction: (event: React.FormEvent) => Promise<void>;
  handleFileChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
}

const PopupExcel = ({ file, setFile, setFunction, submitFunction, handleFileChange, loading }: Props) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const dict = useTranslations("dict");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event);
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setFunction(false);
    }, 300);
  };

  return (
    <form className={`${styles.form_container} ${closing && styles.closing}`} onSubmit={submitFunction}>
      <div className={styles.inner_container}>
        <div className={styles.btn_close}>
          <button onClick={handleClose} type='button'>
            <Icon name='close' width={30} height={30} strokeColor='#7f7f7f' />
          </button>
        </div>
        <header className={styles.header}>
          <p className={styles.title}>Massive upload from Excel</p>
          <p className={styles.text}>Download the template and import the products from Excel</p>
        </header>
        <div className={styles.btn_template}>
          <Button
            title='Donwload template'
            icon={<Icon name='arrow_download' strokeColor='#7f7f7f' width={25} height={25} viewBox='0 -3 30 30' />}
            styleName='btn_upload'
          />
        </div>
        <DragAndDrop file={file} setFile={setFile} img='Excel' />
        <div className={styles.btn_upload}>
          <Button title='Upload' type='submit' loading={loading} />
        </div>
      </div>
    </form>
  );
};

export default PopupExcel;
