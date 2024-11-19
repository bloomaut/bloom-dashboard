import { useCatalogStoreContext } from "@/context/CatalogStoreContext";
import { useMessageToast } from "@/hooks/useMessageToast";
import { putFile } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
// Components
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import LoadingSpinner from "@/components/Loading";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import PopupExcel from "./PopupExcel";
import Header from "./Header";
import PopupUpdatePrices from "./PopupUpdatePrices";

const Detail = () => {
  const [massiveUpdatePopup, setMassiveUpdatePopup] = useState<boolean>(false);
  const [updatePricePopup, setUpdatePricePopup] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sortedDataItems, setSortedDataItems] = useState<any[]>([]);
  const [dataItemsCount, setDataItemsCount] = useState<number>(0);
  const { loading, setLoading, datasetDetail, fetchDatasetById } = useCatalogStoreContext();
  const { notify, notifyError } = useMessageToast();
  const { id } = useParams();
  const dict = useTranslations("dict");

  const handleMassiveUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      setLoading(true);
      const response = await putFile(`datasets/${id}/update`, selectedFile, ENV.BOX);
      if (!response.error && response.data.statusCode === 200) {
        fetchDatasetById();
        setLoading(false);
        notify(dict("toast.success_file"));
      } else {
        notifyError(dict("toast.error_uploading"));
      }
      setMassiveUpdatePopup(false);
    }
  };

  useEffect(() => {
    if (datasetDetail && datasetDetail.dataItems) {
      const sortedItems = [...datasetDetail.dataItems].sort((a, b) => a.order - b.order);
      setSortedDataItems(sortedItems);
      setDataItemsCount(sortedItems.length);
    }
  }, [datasetDetail]);

  return (
    <section className={styles.catalog_detail_container}>
      <Header name={datasetDetail?.dataSet.name} quantity={dataItemsCount} id={id} />
      <div className={styles.table_container}>
        <TableHead />
        {!datasetDetail ? (
          <LoadingSpinner />
        ) : sortedDataItems.length ? (
          <div className={styles.content_container}>
            {sortedDataItems.map((item: any) => (
              <TableRow
                key={item._id}
                id={item._id}
                name={item.data.listname}
                description={item.data.listdescr}
                price={item.data.listprice}
                image={item.data.listimage}
                position={item.order}
              />
            ))}
          </div>
        ) : (
          <p className={styles.catalog_empty}>{dict("catalog.empty")}</p>
        )}
      </div>
      <div className={styles.btn_container}>
        <Button
          title={dict("catalog.update_prices")}
          styleName='btn_update_prices'
          onclick={() => setUpdatePricePopup(true)}
        />
        <Button
          title={dict("catalog.massive_update")}
          styleName='btn_upload'
          icon={<Icon name='reload' strokeColor='#7f7f7f' width={25} height={25} viewBox='0 0 22 15' />}
          onclick={() => setMassiveUpdatePopup(true)}
        />
      </div>
      {massiveUpdatePopup && (
        <PopupExcel
          type='update'
          title={dict("catalog.popup_excel.massive_update_title")}
          subtitle={dict("catalog.popup_excel.massive_update_subtitle")}
          id={typeof id === "string" ? id : id[0]}
          file={selectedFile}
          setFile={setSelectedFile}
          loading={loading}
          setFunction={setMassiveUpdatePopup}
          submitFunction={handleMassiveUpload}
        />
      )}
      {updatePricePopup && <PopupUpdatePrices closePopup={setUpdatePricePopup} id={id} />}
    </section>
  );
};

export default Detail;
