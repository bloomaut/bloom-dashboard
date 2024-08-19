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
import { ServiceData } from "@/typescript/interfaces/catalog.interface";
import { useCatalogServiceContext } from "@/context/CatalogServicesContext";

interface Props extends ServiceData {
  id: string;
  position: number;
}

const TableRow = ({
  id,
  position,
  serviceName,
  serviceDescr,
  serviceImage,
  servicePrice,
  duration,
  fridayFrom,
  fridayTo,
  lunchFrom,
  lunchTo,
  mondayFrom,
  mondayTo,
  saturdayFrom,
  saturdayTo,
  simultaneous,
  sundayFrom,
  sundayTo,
  thursdayFrom,
  thursdayTo,
  tuesdayFrom,
  tuesdayTo,
  wednesdayFrom,
  wednesdayTo,
}: Props) => {
  const { handleRemoveService } = useCatalogServiceContext();
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dict = useTranslations("dict");
  const { notify, notifyError } = useMessageToast();
  const [showPopupEdit, setShowPopupEdit] = useState(false);

  console.log(
    duration,
    fridayFrom,
    fridayTo,
    lunchFrom,
    lunchTo,
    mondayFrom,
    mondayTo,
    saturdayFrom,
    saturdayTo,
    simultaneous,
    sundayFrom,
    sundayTo,
    thursdayFrom,
    thursdayTo,
    tuesdayFrom,
    tuesdayTo,
    wednesdayFrom,
    wednesdayTo,
  );

  const submitDelete = async () => {
    setLoading(true);
    const response = await remove("dataitem", id, ENV.BOX);
    if (response.statusCode === 200) {
      setShowPopupDelete(false);
      handleRemoveService(id);
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

  return (
    <div className={styles.container}>
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
      <p className={styles.box}>{serviceDescr}</p>
      <div className={styles.box}>
        <p>$ {servicePrice}</p>
      </div>
      <div className={styles.box}>DIASSSSSSSS</div>
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
      {/* {showPopupEdit && (
        <Form
          action='put'
          title={dict("popup.edit_product")}
          id={id}
          setShowPopup={setShowPopupEdit}
          allProducts={allProducts}
          onUpdate={onUpdate}
        />
      )} */}
    </div>
  );
};

export default TableRow;
