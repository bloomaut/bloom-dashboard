import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { SelectOptionsCatalog } from "@/utils/selectOptionsCatalog";
import { useCatalogDetailContext } from "@/context/CatalogDetailContext";
import { useParams } from "next/navigation";
import { postFile, putFile } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useState } from "react";

// Components
import Breadcrumb from "@/components/Breadcrumb";
import Title from "@/components/Title";
import Button from "@/components/Button";
import TableHead from "./TableHead";
import Select from "./Select";
import Icon from "@/components/Icon";
import TableRow from "./TableRow";
import LoadingSpinner from "@/components/Loading";
import PopupChildren from "@/components/PopupChildren";
import Form from "./Form";
import PopupExcel from "./PopupExcel";

const Detail = () => {
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [openTrainBot, setOpenTrainBot] = useState<boolean>(false);
  const [uploadPopup, setUploadPopup] = useState<boolean>(false);
  const [putPopup, setPutPopup] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dict = useTranslations("dict");
  const { datasetDetail } = useCatalogDetailContext();
  const { notify, notifyError } = useMessageToast();
  const { id } = useParams();

  const handleDropdown = (value: string) => {
    // Acá después ver lógica de enpoints. Tal vez mover o cambiar
    switch (value) {
      case "download_post_template":
        break;
      case "upload_post_excel":
        setUploadPopup(!uploadPopup);
        break;
      case "download_update_template":
        break;
      case "upload_update_excel":
        setPutPopup(!putPopup);
        break;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const submitExcel = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile && uploadPopup) {
      const response = await postFile(`datasets/${id}/create`, selectedFile, ENV.BOX);
      console.log(response);
      if (!response.error && response.data.statusCode === 201) {
        notify(dict("toast.success_file"));
      } else {
        notifyError(dict("toast.error_uploading"));
      }
      setUploadPopup(false);
    } else if (selectedFile && putPopup) {
      const response = await putFile(`datasets/${id}/update`, selectedFile, ENV.BOX);
      if (!response.error && response.data.statusCode === 200) {
        notify(dict("toast.success_update"));
      } else {
        notifyError(dict("toast.error_update"));
      }
      setPutPopup(false);
    }
  };

  return (
    <section className={styles.catalog_detail_container}>
      <div className={styles.header_container}>
        <Breadcrumb />
        <div className={styles.header}>
          <div className={styles.title_container}>
            <Title text={`${dict("catalog.title")}:`} />
            <p className={styles.catalog}>{datasetDetail?.dataSet.name}</p>
          </div>
          <Button
            title={dict("catalog.add_product")}
            styleName='btn_orange'
            icon={<Icon name='add' viewBox='0 0 25 20' strokeColor='#fff' />}
            onclick={() => setShowPopupCreate(true)}
          />
        </div>
        <div className={styles.select_container}>
          <Select
            options={SelectOptionsCatalog("first")}
            placeholder={dict("catalog.select.placeholder_one")}
            onChange={handleDropdown}
          />
          <Select
            options={SelectOptionsCatalog("second")}
            placeholder={dict("catalog.select.placeholder_two")}
            onChange={handleDropdown}
          />
          {uploadPopup && (
            <PopupExcel setFunction={setUploadPopup} handleFileChange={handleFileChange} submitFunction={submitExcel} />
          )}
          {putPopup && (
            <PopupExcel setFunction={setPutPopup} handleFileChange={handleFileChange} submitFunction={submitExcel} />
          )}
        </div>
      </div>
      <div className={styles.table_container}>
        <TableHead />
        {!datasetDetail ? (
          <LoadingSpinner />
        ) : datasetDetail?.dataItems.length ? (
          <div className={styles.content_container}>
            {datasetDetail.dataItems.map(item => (
              <TableRow
                key={item._id}
                id={item._id}
                name={item.data.listname}
                description={item.data.listdescr}
                price={item.data.listprice}
                image={item.data.listimage}
              />
            ))}
          </div>
        ) : (
          <p className={styles.catalog_empty}>{dict("catalog.empty")}</p>
        )}
      </div>
      <div className={styles.buttons}>
        <Button
          title={dict("catalog.clean_bot")}
          styleName='btn_clean'
          icon={<Icon name='clean' strokeColor='#7F7F7F' viewBox='0 -4 25 25' />}
        />
        <Button
          title={dict("catalog.train_bot")}
          styleName='btn_dataset'
          icon={<Icon name='train' strokeColor='white' viewBox='0 -3 25 25' />}
          onclick={() => setOpenTrainBot(true)}
        />
      </div>
      {showPopupCreate && <Form setShowPopupCreate={setShowPopupCreate} />}
      {openTrainBot && (
        <PopupChildren
          onCancel={() => setOpenTrainBot(false)}
          title={dict("catalog.train_bots")}
          textAccept={dict("popup.train")}
          textCancel={dict("popup.cancel")}
          onConfirm={() => setOpenTrainBot(false)}
          setShowConfirmation={setOpenTrainBot}
        >
          <p className={styles.trainbot_text}>{dict("train_bots_text")}</p>
        </PopupChildren>
      )}
    </section>
  );
};

export default Detail;
