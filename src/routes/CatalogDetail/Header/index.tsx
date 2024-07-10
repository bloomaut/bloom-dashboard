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
  name: string;
  id: string | string[];
}

const Header = ({ name, id }: Header) => {
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [bulkLoadPopup, setBulkLoadPopup] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { datasetDetail, fetchDatasetById } = useCatalogDetailContext();
  const dict = useTranslations("dict.catalog");
  const { notify, notifyError } = useMessageToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      notify(dict("toast.success_file_add"));
    }
  };

  const handleBulkLoad = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile && bulkLoadPopup) {
      const response = await postFile(`datasets/${id}/create`, selectedFile, ENV.BOX);
      if (!response.error && response.data.statusCode === 201) {
        fetchDatasetById();
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
        <p className={styles.catalog}>{name}</p>
      </div>
      <div className={styles.btn_container}>
        <Button
          title={dict("massive_upload")}
          styleName='btn_upload'
          icon={<Icon name='arrow_upload' strokeColor='#7f7f7f' width={25} height={25} viewBox='0 -5 30 30' />}
          onclick={() => setBulkLoadPopup(true)}
        />
        <Button
          title={dict("add_product")}
          styleName='btn_add'
          icon={<Icon name='add' viewBox='0 0 20 22' strokeColor='#fff' width={18} height={18} strokeWidth={2} />}
          onclick={() => setShowPopupCreate(true)}
        />
      </div>
      {bulkLoadPopup && (
        <PopupExcel
          title='Bulk load from Excel'
          subtitle='Download the template and import the products from Excel'
          id={typeof id === "string" ? id : id[0]}
          file={selectedFile}
          setFile={setSelectedFile}
          setFunction={setBulkLoadPopup}
          handleFileChange={handleFileChange}
          submitFunction={handleBulkLoad}
        />
      )}
      {showPopupCreate && <Form action='post' title={dict("popup.create_product")} setShowPopup={setShowPopupCreate} />}
    </div>
  );
};

export default Header;
