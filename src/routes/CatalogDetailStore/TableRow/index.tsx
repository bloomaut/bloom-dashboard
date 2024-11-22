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
import Form from "../Form";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { AllProducts } from "@/typescript/interfaces/catalog.interface";
import { useCatalogStoreContext } from "@/context/CatalogStoreContext";

interface Props {
  id: string;
  name: string;
  catalog?: string;
  description: string;
  variants: any[];
  price: number | null;
  image: string;
  position: number;
  allProducts?: AllProducts[];
  onDelete?: (id: string) => void;
  onUpdate?: (updatedItem: AllProducts) => void;
}

const TableRow = ({
  id,
  name,
  catalog,
  description,
  variants,
  price,
  image,
  position,
  allProducts,
  onDelete,
  onUpdate,
}: Props) => {
  const { handleRemoveDataset } = useCatalogStoreContext();
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dict = useTranslations("dict");
  const { notify, notifyError } = useMessageToast();
  const [showPopupEdit, setShowPopupEdit] = useState(false);

  const submitDelete = async () => {
    setLoading(true);
    const response = await remove("dataitem", id, ENV.BOX);
    if (response.statusCode === 200) {
      setShowPopupDelete(false);
      if (onDelete) {
        onDelete(id);
      } else {
        handleRemoveDataset(id);
      }
      notify(`${dict("toast.success_product_deleted")}`);
      setLoading(false);
    } else {
      notifyError(`${dict("toast.error_product_deleted")}`);
    }
  };

  // Expresión regular para validar URLs cuando se carga una imágen a traves de Excel
  const isValidImageUrl = (url: string) => {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
  };

  const openVariants = () => {
    setShowVariants(!showVariants);
  };

  return (
    <div className={styles.container}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: allProducts ? "0.2fr 1.5fr 1fr 2.5fr 0.5fr 1fr" : "0.2fr 1fr 2.5fr 0.5fr 1fr",
        }}
      >
        <div className={styles.order}>{position}</div>
        <div className={styles.name_container}>
          {isValidImageUrl(image) ? (
            <Zoom classDialog='custom-zoom'>
              <Image src={image} className={styles.image} alt={name} width={300} height={300} />
            </Zoom>
          ) : (
            <div className={styles.icon_container}>
              <Icon name='dataset' width={30} height={30} strokeColor={"#BEBEBE"} />
            </div>
          )}
          <p className={styles.box}>{name}</p>
        </div>
        {allProducts && <p className={styles.box}>{catalog}</p>}
        <div className={styles.box}>
          <p>$ {price}</p>
        </div>
        <div className={`${styles.box} ${styles.icon_variants}`}>
          <p className={`${styles.description}`}>{variants?.length}</p>
          <Button
            title=''
            styleName='bg_transparent'
            icon={
              <Icon
                name={showVariants ? "arrow_up_chevron" : "arrow_down_chevron"}
                width={25}
                height={25}
                strokeColor='#7f7f7f'
                viewBox='0 0 25 18'
              />
            }
            onclick={() => openVariants()}
          />
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
            allProducts={allProducts}
            onUpdate={onUpdate}
          />
        )}
      </div>
      {showVariants && (
        <div className={styles.box_variants}>
          {variants.length === 0 && (
            <div className={styles.no_variants}>
              <p>This product does not have variants yet.</p>
            </div>
          )}
          <div className={styles.add_variant}>
            <Button
              title='Add new variant'
              styleName='btn_variant'
              icon={<Icon name='add' width={25} height={25} strokeColor='#7f7f7f' viewBox='0 0 25 18' />}
              onclick={() => console.log('Add new variant')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableRow;
