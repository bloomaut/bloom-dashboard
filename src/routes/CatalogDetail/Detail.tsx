import { useCatalogDetailContext } from "@/context/CatalogDetailContext";
import { useMessageToast } from "@/hooks/useMessageToast";
import { getExcelCatalog, postFile } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { SelectOptionsCatalog } from "@/utils/selectOptionsCatalog";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { handleBotAction } from "@/utils/handleBotAction";
import styles from "./styles.module.scss";
import excel from "/public/assets/excel_logo.svg";
// Components
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import LoadingSpinner from "@/components/Loading";
import PopupChildren from "@/components/PopupChildren";
import Title from "@/components/Title";
import Image from "next/image";
import Form from "./Form";
import Select from "./Select";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import { downloadExcel } from "@/utils/downloadExcel";

const Detail = () => {
  const dict = useTranslations("dict");
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [openTrainBot, setOpenTrainBot] = useState(false);
  const [openCleanBot, setOpenCleanBot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadPopup, setUploadPopup] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { datasetDetail } = useCatalogDetailContext();
  const { notify, notifyError } = useMessageToast();
  const { id } = useParams();

  const handleDropdown = (value: string) => {
    // Acá después ver lógica de enpoints. Tal vez mover o cambiar
    switch (value) {
      case "download_post_template":
        handleExcelDownload("template");
        break;
      case "upload_post_excel":
        setUploadPopup(!uploadPopup);

        break;
      case "download_update_template":
        handleExcelDownload("download");
        break;
      case "upload_update_excel":
        break;
    }
  };

  const dataSetId = datasetDetail?.dataSet._id;
  const handleBotTrainer = async (e: FormEvent) => {
    e.preventDefault();
    if (dataSetId) {
      await handleBotAction(
        `datasets/${dataSetId}/vectorize`,
        "post",
        dict("toast.bot_train"),
        dict("toast.bot_error"),
        setLoading,
        setOpenTrainBot,
      );
    }
  };

  const handleBotCleaner = async (e: FormEvent) => {
    e.preventDefault();
    if (dataSetId) {
      await handleBotAction(
        `datasets/${dataSetId}/vectorize`,
        "remove",
        dict("toast.bot_clean"),
        dict("toast.bot_error"),
        setLoading,
        setOpenCleanBot,
      );
    }
  };
  const handleExcelDownload = async (type: string) => {
    if (dataSetId) await getExcelCatalog(dataSetId, type, "getExcelCatalog");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const submitExcel = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      const response = await postFile(`datasets/${id}/create`, selectedFile, ENV.BOX);
      if (response.data.statusCode === 201) {
        notify(dict("toast.success_file"));
      } else {
        notifyError(dict("toast.error_uploading"));
      }
      setUploadPopup(false);
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
            <PopupChildren
              onCancel={() => setUploadPopup(false)}
              title={dict("catalog.upload_excel_title")}
              textAccept={dict("popup.upload")}
              textCancel={dict("popup.cancel")}
              onConfirm={submitExcel}
              setShowConfirmation={setUploadPopup}
            >
              <input
                type='file'
                accept='.xlsx, .xls'
                id='fileInput'
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor='fileInput' className={styles.excel_button}>
                <Image src={excel} width={25} alt='excel' />
                <p>{dict("catalog.upload_excel")}</p>
                <Icon name='arrow_upload' strokeColor='white' width={25} height={25} viewBox='0 -5 30 30' />
              </label>
            </PopupChildren>
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
          onclick={() => setOpenCleanBot(true)}
        />
        <Button
          title={dict("catalog.train_bot")}
          styleName='btn_dataset'
          icon={<Icon name='train' strokeColor='white' viewBox='0 -3 25 25' />}
          onclick={() => setOpenTrainBot(true)}
        />
      </div>
      {showPopupCreate && <Form action='post' title={dict("popup.create_product")} setShowPopup={setShowPopupCreate} />}
      {openTrainBot && (
        <PopupChildren
          onCancel={() => setOpenTrainBot(false)}
          title={dict("catalog.train_bots")}
          textAccept={dict("catalog.train_bot")}
          textCancel={dict("catalog.cancel")}
          onConfirm={handleBotTrainer}
          setShowConfirmation={setOpenTrainBot}
          loading={loading}
        >
          <p className={styles.trainbot_text}>{dict("catalog.train_bots_text")}</p>
        </PopupChildren>
      )}
      {openCleanBot && (
        <PopupChildren
          onCancel={() => setOpenCleanBot(false)}
          title={dict("catalog.clean_bots")}
          textAccept={dict("catalog.clean_bot")}
          textCancel={dict("catalog.cancel")}
          onConfirm={handleBotCleaner}
          setShowConfirmation={setOpenCleanBot}
          loading={loading}
        >
          <p className={styles.trainbot_text}>{dict("catalog.clean_bots_text")}</p>
        </PopupChildren>
      )}
    </section>
  );
};

export default Detail;
