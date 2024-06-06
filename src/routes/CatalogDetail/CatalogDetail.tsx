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
import { useState } from "react";
import PopupChildren from "@/components/PopupChildren";

const Detail = () => {
  const dict = useTranslations("dict");
  const [openTrainBot, setOpenTrainBot] = useState(false);
  const { datasetDetail } = useCatalogContext();

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
          onclick={() => setOpenTrainBot(true)}
        />
      </div>
      {openTrainBot && (
        <PopupChildren
          onCancel={() => setOpenTrainBot(false)}
          title={dict("catalog.train_bots")}
          textAccept={dict("popup.train")}
          textCancel={dict("popup.cancel")}
          onConfirm={() => setOpenTrainBot(false)}
          setShowConfirmation={setOpenTrainBot}
        >
          <p className={styles.trainbot_text}>{dict("catalog.train_bots_text")}</p>
        </PopupChildren>
      )}
    </section>
  );
};

export default Detail;
