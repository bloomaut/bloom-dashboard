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

const Header = () => {
  const dict = useTranslations("dict.my-collection");
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
        <Title text={`${loading ? dict("loading") : hotlinkCollection?.name}`} />
        <h4 className={styles.subtitle}>
          {loading
            ? dict("loading")
            : `${hotlinkCollection?.flake?.skinx?.title || "Skinx Title"} / ${hotlinkCollection?.flake?.title || "Flake Title"}`}
        </h4>
        <Search
          searchValue={searchValue}
          handleSearchChange={e => setSearchValue(e.target.value)}
          placeholder={dict("search_holder")}
        />
      </div>
      <div className={styles.column_two}>
        <div className={styles.btn_container}>
          <Button
            title={dict("btn3")}
            icon={
              <Icon name='table' width={25} height={25} strokeColor='#7f7f7f' strokeWidth={1.4} viewBox='0 0 25 14' />
            }
            styleName='btn_copy'
            onclick={handleClick}
          />

          <Button
            title={dict("btn2")}
            icon={<Icon name='excel' />}
            styleName='btn_excel'
            onclick={() => setShowPopupExcel(true)}
          />
        </div>
        <Button
          title={dict("btn")}
          icon={<Icon name='hotlink' className='hotlink_white' viewBox='0 0 35 35' />}
          styleName='btn_my_collection'
        />
      </div>
      {showPopupExcel && (
        <PopupConfirm
          dragAndDrop={true}
          file={file}
          setFile={setFile}
          setShowConfirmation={setShowPopupExcel}
          onCancel={() => setShowPopupExcel(false)}
          onReset={() => setFile(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default Header;
