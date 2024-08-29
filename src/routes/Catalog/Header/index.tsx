import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
// Components
import Title from "@/components/Title";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useState } from "react";
import { createPortal } from "react-dom";
import PopupIA from "./PopupIA";
import { postExcel } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useCatalogContext } from "@/context/CatalogContext";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";

const Header = () => {
  const [popupIA, setPopupIA] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loadingPopup, setLoadingPopup] = useState(false);
  const { notify, notifyError } = useMessageToast();
  const { handleAddDataset } = useCatalogContext();
  const dict = useTranslations("dict");

  const handleCreate = async () => {
    if (file) {
      try {
        setLoadingPopup(true);
        const data = await postExcel(file);
        if (data.statusCode === 201) {
          const datasets = data.result;
          datasets.forEach((dataset: DatasetProps) => {
            handleAddDataset(dataset);
          });
          setPopupIA(false);
          setLoadingPopup(false);
          setFile(null);
          notify(dict("toast.success_datasets"));
        }
      } catch (error) {
        notifyError(dict("toast.error_datasets"));
        console.error("Error uploading Excel file:", error);
        setLoadingPopup(false);
      }
    }
  };

  return (
    <div className={styles.header}>
      <Title text={dict("catalog.title")} />
      <div className={styles.btn_container}>
        <Button
          title={dict("catalog.ia")}
          icon={<Icon name='ia' strokeColor='#7f7f7f' viewBox='0 0 25 21' />}
          styleName='btn_outline'
          onclick={() => setPopupIA(true)}
        />
        {popupIA &&
          createPortal(
            <PopupIA
              title={dict("popup.excel.title")}
              subtitle={dict("popup.excel.subtitle")}
              text={dict("popup.excel.text")}
              file={file}
              setFile={setFile}
              onCancel={() => setPopupIA(false)}
              onReset={() => setFile(null)}
              onConfirm={handleCreate}
              loading={loadingPopup}
            />,
            document.body,
          )}
      </div>
    </div>
  );
};

export default Header;
