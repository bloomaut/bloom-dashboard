import styles from "./styles.module.scss";
import { Fade } from "react-awesome-reveal";
import { useCatalogContext } from "@/context/CatalogContext";
import { useTranslations } from "next-intl";
import { SelectOptionsCatalog } from "@/utils/selectOptionsCatalog";
// Components
import Breadcrumb from "@/components/Breadcrumb";
import Title from "@/components/Title";
import Button from "@/components/Button";
import TableHead from "./TableHead";
import Icon from "@/components/Icon";
import TableRow from "./TableRow";
import LoadingSpinner from "@/components/Loading";
import Select from "./Select";
import { useState } from "react";
import PopupChildren from "@/components/PopupChildren";
import Image from "next/image";
import excel from "/public/assets/excel_logo.svg";
import { useParams } from "next/navigation";

const Detail = () => {
  const dict = useTranslations("dict.catalog");
  const dictpopup = useTranslations("dict.popup");
  const [openTrainBot, setOpenTrainBot] = useState<boolean>(false);
  const [uploadPopup, setUploadPopup] = useState<boolean>(false);
  const { datasetDetail, postExcel } = useCatalogContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    if (selectedFile) {
      console.log(id, "SID");
      postExcel(selectedFile, id);
      setUploadPopup(false);
    }
  };

  return (
    <section className={styles.catalog_detail_container}>
      <div className={styles.header_container}>
        <Breadcrumb />
        <div className={styles.header}>
          <div className={styles.title_container}>
            <Title text={`${dict("title")}:`} />
            <p className={styles.catalog}>{datasetDetail?.dataSet.name}</p>
          </div>
          <Button
            title={dict("add_product")}
            styleName='btn_orange'
            icon={<Icon name='add' viewBox='0 0 25 20' strokeColor='#fff' />}
          />
        </div>
        <div className={styles.select_container}>
          <Select
            options={SelectOptionsCatalog("first")}
            placeholder={dict("select.placeholder_one")}
            onchange={handleDropdown}
          />
          <Select
            options={SelectOptionsCatalog("second")}
            placeholder={dict("select.placeholder_two")}
            onchange={handleDropdown}
          />
          {uploadPopup && (
            <PopupChildren
              onCancel={() => setUploadPopup(false)}
              title={dict("upload_excel_title")}
              textAccept={dictpopup("upload")}
              textCancel={dictpopup("cancel")}
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
                <p>{dict("upload_excel")}</p>
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
            <Fade cascade damping={0.3} triggerOnce>
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
            </Fade>
          </div>
        ) : (
          <p className={styles.catalog_empty}>{dict("empty")}</p>
        )}
      </div>
      <div className={styles.buttons}>
        <Button
          title={dict("clean_bot")}
          styleName='btn_clean'
          icon={<Icon name='clean' strokeColor='#7F7F7F' viewBox='0 -4 25 25' />}
        />
        <Button
          title={dict("train_bot")}
          styleName='btn_dataset'
          icon={<Icon name='train' strokeColor='white' viewBox='0 -3 25 25' />}
          onclick={() => setOpenTrainBot(true)}
        />
      </div>
      {openTrainBot && (
        <PopupChildren
          onCancel={() => setOpenTrainBot(false)}
          title={dict("train_bots")}
          textAccept={dictpopup("train")}
          textCancel={dictpopup("cancel")}
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
