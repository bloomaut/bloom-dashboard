import styles from "./styles.module.scss";
import PopupChildren from "@/components/PopupChildren";
import excel from "/public/assets/excel_logo.svg";
import Icon from "@/components/Icon";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Props {
  setFunction: (value: React.SetStateAction<boolean>) => void;
  submitFunction: (event: React.FormEvent) => Promise<void>;
  handleFileChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
}

const PopupExcel = ({ setFunction, submitFunction, handleFileChange, loading }: Props) => {
  const dict = useTranslations("dict");

  return (
    <PopupChildren
      onCancel={() => setFunction(false)}
      title={dict("catalog.upload_excel_title")}
      textAccept={dict("popup.upload")}
      textCancel={dict("popup.cancel")}
      onConfirm={submitFunction}
      setShowConfirmation={setFunction}
      loading={loading}
    >
      <input type='file' accept='.xlsx, .xls' id='fileInput' onChange={handleFileChange} style={{ display: "none" }} />
      <label htmlFor='fileInput' className={styles.excel_button}>
        <Image src={excel} width={25} alt='excel' />
        <p>{dict("catalog.upload_excel")}</p>
        <Icon name='arrow_upload' strokeColor='white' width={25} height={25} viewBox='0 -5 30 30' />
      </label>
    </PopupChildren>
  );
};

export default PopupExcel;
