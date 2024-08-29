import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
// Components
import Title from "@/components/Title";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useState } from "react";
import { createPortal } from "react-dom";
import PopupIA from "./PopupIA";

const Header = () => {
  const [popupIA, setPopupIA] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loadingPopup, setLoadingPopup] = useState(false);

  const dict = useTranslations("dict");

  const handleCreate = () => {
    setLoadingPopup(false);
    setPopupIA(false);
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
              title='Upload from Excel with AI'
              subtitle='Load your excel with products and we will process it with ChatGPT to extract catalogs and products with artificial intelligence.'
              text='This process can take up to 60 seconds.'
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
