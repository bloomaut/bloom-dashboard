import Image from "next/image";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import PopupConfirm from "@/components/PopupConfirm";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { remove } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ENV } from "@/typescript/types/api";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { DataItemsServiceType, ServiceData } from "@/typescript/interfaces/catalog.interface";
import { useCatalogServiceContext } from "@/context/CatalogServicesContext";
import { useDaysRenderer } from "@/hooks/useDaysRenderer";
import Form from "../Form";

interface Props extends ServiceData {
  id: string;
  position: number;
  catalog?: string;
  allServices?: DataItemsServiceType[];
  onDelete?: (id: string) => void;
  onUpdate?: (updatedItem: DataItemsServiceType) => void;
}

const TableRow = ({
  id,
  position,
  serviceName,
  serviceDescr,
  serviceImage,
  servicePrice,
  fridayFrom,
  fridayTo,
  mondayFrom,
  mondayTo,
  saturdayFrom,
  saturdayTo,
  sundayFrom,
  sundayTo,
  thursdayFrom,
  thursdayTo,
  tuesdayFrom,
  tuesdayTo,
  wednesdayFrom,
  wednesdayTo,
  catalog,
  allServices,
  onUpdate,
  onDelete,
}: Props) => {
  const { handleRemoveService } = useCatalogServiceContext();
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { notify, notifyError } = useMessageToast();
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const dict = useTranslations("dict");

  const submitDelete = async () => {
    setLoading(true);
    const response = await remove("dataitem", id, ENV.BOX);
    if (response.statusCode === 200) {
      setShowPopupDelete(false);
      if (onDelete) {
        onDelete(id);
      } else {
        handleRemoveService(id);
      }
      notify(`${dict("toast.success_product_deleted")}`);
      setLoading(false);
    } else {
      notifyError(`${dict("toast.error_product_deleted")}`);
    }
  };

  const isValidImageUrl = (url: string) => {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
  };

  const days = useDaysRenderer({
    mondayFrom,
    mondayTo,
    tuesdayFrom,
    tuesdayTo,
    wednesdayFrom,
    wednesdayTo,
    thursdayFrom,
    thursdayTo,
    fridayFrom,
    fridayTo,
    saturdayFrom,
    saturdayTo,
    sundayFrom,
    sundayTo,
  });

  return (
    <div
      className={styles.container}
      style={{
        display: "grid",
        gridTemplateColumns: allServices
          ? "0.2fr 1.5fr 1fr 2.5fr 0.6fr 1.4fr 1fr"
          : "0.65fr 3.3fr 6.6fr 1.72fr 3fr 0.5fr",
      }}
    >
      <div className={styles.order}>{position}</div>
      <div className={styles.image_container}>
        {isValidImageUrl(serviceImage) ? (
          <Zoom classDialog='custom-zoom'>
            <Image src={serviceImage} className={styles.image} alt={serviceName} width={300} height={300} />
          </Zoom>
        ) : (
          <div className={styles.icon_container}>
            <Icon name='dataset' width={30} height={30} strokeColor={"#BEBEBE"} />
          </div>
        )}
        <p className={styles.box}>{serviceName}</p>
      </div>
      {allServices && <p className={styles.box}>{catalog}</p>}
      <p className={styles.box}>{serviceDescr}</p>
      <div className={styles.box}>
        <p>$ {servicePrice}</p>
      </div>
      <div className={styles.days_container}>
        {days.map(({ day, from }, index) => (
          <div
            key={index}
            className={`${styles.dayBox} ${from ? styles.activeDay : ""}`}
            title={from ? `${dict("catalog.available")}` : `${dict("catalog.not_available")}`}
          >
            {day}
            {index < days.length - 1 && <span className={styles.separator}> - </span>}
          </div>
        ))}
      </div>
      <div className={`${styles.icons} ${styles.box}`}>
        <Button
          title=''
          styleName='bg_transparent'
          icon={<Icon name='edit' width={25} height={25} strokeColor='#7f7f7f' viewBox='0 0 25 18' />}
          onclick={() => setShowPopupEdit(true)}
        />
        <Button
          title=''
          styleName='bg_transparent'
          icon={<Icon name='delete' width={20} height={20} strokeColor='#7f7f7f' viewBox='0 0 23 22' />}
          onclick={() => setShowPopupDelete(true)}
        />
      </div>
      {showPopupDelete && (
        <PopupConfirm
          onConfirm={submitDelete}
          onCancel={() => setShowPopupDelete(false)}
          setShowConfirmation={setShowPopupDelete}
          title={dict("popup.delete_product")}
          loading={loading}
          textCancel={dict("popup.cancel")}
          textAccept={dict("popup.confirm")}
        />
      )}
      {showPopupEdit && (
        <Form
          action='put'
          title={dict("popup.edit_product")}
          id={id}
          setShowPopup={setShowPopupEdit}
          allServices={allServices}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default TableRow;
