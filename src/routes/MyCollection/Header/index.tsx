import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useHotlinkListContext } from "@/context/HotlinksListContext";
import { getExcel } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
// Components
import Title from "@/components/Title";
import Search from "@/components/Search";
import Button from "@/components/Button";
import PopupConfirm from "@/components/PopupConfirm";
import Icon from "@/components/Icon";
import PopupChildren from "@/components/PopupChildren";
import DragAndDrop from "@/components/DragAndDrop";

const Header = () => {
  const dict = useTranslations("dict");
  const { loading, hotlinkCollection } = useHotlinkListContext();
  const { notifyError } = useMessageToast();
  const [searchValue, setSearchValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showPopupExcel, setShowPopupExcel] = useState(false);

  // CARGA MASIVA DE HOTLINKS A TRAVES DE EXCEL
  const handleConfirm = () => {
    setShowPopupExcel(false);
  };

  const handleClick = async () => {
    try {
      await getExcel(`${hotlinkCollection?.flake._id}`);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      notifyError("Error al descargar el archivo");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <Title text={`${loading ? dict("my-collection.loading") : hotlinkCollection?.name}`} />
        <Search
          searchValue={searchValue}
          handleSearchChange={e => setSearchValue(e.target.value)}
          placeholder={dict("my-collection.search_holder")}
        />
      </div>
      <div className={styles.column_two}>
        <div className={styles.btn_container}>
          <Button
            title={dict("my-collection.btn3")}
            icon={
              <Icon name='table' width={25} height={25} strokeColor='#7f7f7f' strokeWidth={1.4} viewBox='0 0 25 14' />
            }
            styleName='btn_copy'
            onclick={handleClick}
          />
          <Button
            title={dict("my-collection.btn2")}
            icon={<Icon name='excel' />}
            styleName='btn_excel'
            onclick={() => setShowPopupExcel(true)}
          />
        </div>
        <Button
          title={dict("my-collection.btn")}
          icon={<Icon name='hotlink' className='hotlink_light' viewBox='0 0 35 35' />}
          styleName='btn_my_collection'
        />
      </div>
      {showPopupExcel && (
        <PopupChildren
          textAccept={"Generar Hotlink"}
          textCancel={dict("popup.cancel")}
          onCancel={() => setFile(null)}
          onConfirm={handleConfirm}
          setShowConfirmation={setShowPopupExcel}
        >
          <DragAndDrop file={file} setFile={setFile} />
          {file !== null && (
            <button className={styles.reset} onClick={() => setFile(null)}>
              Resetear
            </button>
          )}
        </PopupChildren>
      )}
    </div>
  );
};

export default Header;
