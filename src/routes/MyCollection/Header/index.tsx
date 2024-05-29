import styles from "./styles.module.scss";
import excel from "@/../public/assets/excel.png";
import table from "@/../public/icons/excel.svg";
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
          <Button title={dict("btn3")} icon={table} styleName='btn_copy' onclick={handleClick} />
          <Button title={dict("btn2")} icon={excel} styleName='btn_excel' onclick={() => setShowPopupExcel(true)} />
        </div>
        {/* <Button title={dict("btn")} icon={hotlink} styleName='btn_my_collection' /> */}
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
