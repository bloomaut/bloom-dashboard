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
import { useCatalogDetailContext } from "@/context/CatalogDetailContext";

interface Props {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const TableRow = ({ id, name, description, price, image }: Props) => {
  const dict = useTranslations("dict");
  const { notify, notifyError } = useMessageToast();
  const { fetchDatasetById } = useCatalogDetailContext();
  const [showPopupDelete, setShowPopupDelete] = useState(false);

  const submitDelete = async () => {
    const response = await remove("dataitem", id, ENV.BOX);
    if (response.statusCode === 200) {
      setShowPopupDelete(false);
      notify(`${dict("toast.success_product_deleted")}`);
      fetchDatasetById();
    } else {
      notifyError(`${dict("toast.error_product_deleted")}`);
    }
  };

  return (
    <div className={styles.container}>
      {image ? (
        <Image src={image} className={styles.image} alt={name} width={100} height={100} />
      ) : (
        <Icon
          name='dataset'
          width={70}
          height={30}
          viewBox='0 0 84 54'
          strokeColor='#BEBEBE'
          className='dataset_default'
        />
      )}
      <p className={styles.box}>{name}</p>
      <p className={styles.box}>{description}</p>
      <div className={styles.box}>
        <p>{`$ ${price}`}</p>
      </div>
      <div className={`${styles.icons} ${styles.box}`}>
        <Icon name='edit' width={25} height={25} strokeColor='#7f7f7f' viewBox='0 0 25 18' />
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
          textCancel={dict("popup.cancel")}
          textAccept={dict("popup.confirm")}
        />
      )}
    </div>
  );
};

export default TableRow;
