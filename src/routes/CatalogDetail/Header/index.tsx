import Button from "@/components/Button";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Form from "../Form";
import PopupExcel from "../PopupExcel";
import { useMessageToast } from "@/hooks/useMessageToast";
import { postFile } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useCatalogDetailContext } from "@/context/CatalogDetailContext";

interface Header {
  name: string | undefined | null;
  id: string | string[];
  quantity: number | undefined | null;
}

const Header = ({ name, id, quantity }: Header) => {
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [bulkLoadPopup, setBulkLoadPopup] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { loading, setLoading, fetchDatasetById } = useCatalogDetailContext();
  const dict = useTranslations("dict");
  const { notify, notifyError } = useMessageToast();

  const handleBulkLoad = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile && bulkLoadPopup) {
      setLoading(true);
      const response = await postFile(`datasets/${id}/create`, selectedFile, ENV.BOX);
      if (!response.error && response.data.statusCode === 201) {
        fetchDatasetById();
        setLoading(false);
        notify(dict("toast.success_file"));
      } else {
        notifyError(dict("toast.error_uploading"));
      }
      setBulkLoadPopup(false);
    }
  };

  return (
    <div className={styles.header_container}>
      <div className={styles.title_container}>
        <Breadcrumb />
        <p className={styles.catalog}>
          {name}
          {quantity && <span>({quantity})</span>}
        </p>
      </div>
      <div className={styles.btn_container}>
        <Button
          title={dict("catalog.massive_upload")}
          styleName='btn_upload'
          icon={<Icon name='arrow_upload' strokeColor='#7f7f7f' width={25} height={25} viewBox='0 -5 30 30' />}
          onclick={() => setBulkLoadPopup(true)}
        />
        <Button
          title={dict("catalog.add_product")}
          styleName='btn_add'
          icon={<Icon name='add' viewBox='0 0 20 22' strokeColor='#fff' width={18} height={18} strokeWidth={2} />}
          onclick={() => setShowPopupCreate(true)}
        />
      </div>
      {bulkLoadPopup && (
        <PopupExcel
          type='upload'
          title={dict("catalog.popup_excel.massive_upload_title")}
          subtitle={dict("catalog.popup_excel.massive_upload_subtitle")}
          id={typeof id === "string" ? id : id[0]}
          loading={loading}
          file={selectedFile}
          setFile={setSelectedFile}
          setFunction={setBulkLoadPopup}
          submitFunction={handleBulkLoad}
        />
      )}
      {showPopupCreate && <Form action='post' title={dict("popup.create_product")} setShowPopup={setShowPopupCreate} />}
    </div>
  );
};

export default Header;
