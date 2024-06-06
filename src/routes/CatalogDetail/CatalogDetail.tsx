import Breadcrumb from "@/components/Breadcrumb";
import styles from "./styles.module.scss";
import Title from "@/components/Title";
import Button from "@/components/Button";
import TableHead from "./TableHead";
import { Fade } from "react-awesome-reveal";
import Icon from "@/components/Icon";
import { useCatalogContext } from "@/context/CatalogContext";
import { useTranslations } from "next-intl";
import TableRow from "./TableRow";
import LoadingSpinner from "@/components/Loading";
import PopupChildren from "@/components/PopupChildren";
import { useState } from "react";
import { DataItemsList } from "@/typescript/interfaces/catalog.interface";
import Input from "@/components/Input";
import DragAndDrop from "@/components/DragAndDrop";
import { postFile } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";

const initialFormData = {
  listname: "",
  listdescr: "",
  listprice: 0,
  listimage: "",
};

const Detail = () => {
  const dict = useTranslations("dict");
  const { notify, notifyError } = useMessageToast();
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [formData, setFormData] = useState<DataItemsList>(initialFormData);
  const [file, setFile] = useState<File | null>(null);
  const { datasetDetail, postDataItem } = useCatalogContext();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file) {
      try {
        const response = await postFile("small-files/media", file);
        if (response.data.statusCode === 201) {
          const logoUrl = response.data.result.media.url;

          const dataToSend = {
            dataset: datasetDetail?.dataSet._id ?? "",
            data: {
              ...formData,
              listimage: logoUrl,
            },
            order: 0,
          };

          await postDataItem(dataToSend);

          notify(dict("toast.success_item"));
          setShowPopupCreate(false);
          setFormData(initialFormData);
          setFile(null);
        }
      } catch (error) {
        notifyError(dict("toast.error_item"));
        console.error("Error updating dataset:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
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
      </div>
      <div className={styles.table_container}>
        <TableHead />
        {!datasetDetail ? (
          <LoadingSpinner />
        ) : datasetDetail?.dataItems.length ? (
          <div className={styles.content_container}>
            <Fade cascade damping={0.3} triggerOnce>
              {datasetDetail.dataItems.map((item, index) => (
                <TableRow
                  key={index}
                  name={item.data.listname}
                  description={item.data.listdescr}
                  price={item.data.listprice}
                  image={item.data.listimage}
                />
              ))}
            </Fade>
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
        />
      </div>
      {showPopupCreate && (
        <PopupChildren
          title='Agregar Producto'
          onConfirm={handleCreate}
          onCancel={() => setShowPopupCreate(false)}
          setShowConfirmation={setShowPopupCreate}
          textCancel={dict("popup.cancel")}
          textAccept={dict("popup.create")}
        >
          <Input
            type='text'
            textHolder={"Name"}
            name='listname'
            value={formData.listname}
            handleChange={handleChange}
          />
          <Input
            type='text'
            textHolder={"Descripcion"}
            name='listdescr'
            value={formData.listdescr}
            handleChange={handleChange}
          />
          <Input
            type='number'
            textHolder={"Precio"}
            name='listprice'
            value={formData.listprice === 0 ? "" : formData.listprice}
            handleChange={handleChange}
          />
          <DragAndDrop file={file} setFile={setFile} />
        </PopupChildren>
      )}
    </section>
  );
};

export default Detail;
