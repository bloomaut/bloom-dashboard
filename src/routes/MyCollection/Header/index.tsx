import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useState } from "react";
import hotlink from "@/../public/icons/hotlink_icon.svg";
import excel from "@/../public/icons/excel_logo.svg";
import table from "@/../public/icons/excel.svg";
// Components
import Title from "@/components/Title";
import Search from "@/components/Search";
import Button from "@/components/Button";
import PopupConfirm from "@/components/PopupConfirm";
import { useHotlinkListContext } from "@/context/HotlinksListContext";

const Header = () => {
  const dict = useTranslations("dict.my-collection");
  const { hotlinkCollection } = useHotlinkListContext();
  const [searchValue, setSearchValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showPopupExcel, setShowPopupExcel] = useState(false);

  console.log(hotlinkCollection);

  // CARGA MASIVA DE HOTLINKS A TRAVES DE EXCEL
  const handleConfirm = () => {
    setShowPopupExcel(false);
    console.log("Sending request ...");
  };

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <Title text={`${hotlinkCollection?.name}`} />
        <h4
          className={styles.subtitle}
        >{`${hotlinkCollection?.flake.skinx.title} / ${hotlinkCollection?.flake.title}`}</h4>
        <Search
          searchValue={searchValue}
          handleSearchChange={e => setSearchValue(e.target.value)}
          placeholder={dict("search_holder")}
        />
      </div>
      <div className={styles.column_two}>
        <div className={styles.btn_container}>
          <Button title={dict("btn3")} icon={table} styleName='btn_copy' />
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
