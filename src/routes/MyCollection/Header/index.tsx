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
import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { useMessageToast } from "@/hooks/useMessageToast";
import { downloadExcel } from "@/utils/downloadExcel";
import axios from "axios";

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
    console.log("Sending request ...");
  };

  const handleClick = async () => {
    const API = `client-customer/flakes/powerapp/${hotlinkCollection?.flake._id}`;
    // const response = await get(API, ENV.DASH);

    try {
      const response = await axios.get(`/api/${API}`, {
        headers: {
          "X-API": ENV.DASH,
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
      console.log(response);
      if (response.status === 200) {
        downloadExcel(response.data.data);
      }
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      notifyError("Error al descargar el archivo");
    }

    // console.log(response);

    // if (response) {
    //   downloadExcel(response);
    // } else {
    //   console.error("Error al descargar el archivo:", response);
    //   notifyError("Error al descargar el archivo");
    // }
  };

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <Title text={`${loading ? dict("loading") : hotlinkCollection?.name}`} />
        <h4 className={styles.subtitle}>
          {loading
            ? dict("loading")
            : `${hotlinkCollection?.flake.skinx.title || "Skinx Title"} / ${hotlinkCollection?.flake.title || "Flake Title"}`}
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
