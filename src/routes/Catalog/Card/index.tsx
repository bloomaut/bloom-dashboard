import Button from "@/components/Button";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import PopupChildren from "@/components/PopupChildren";
import PopupConfirm from "@/components/PopupConfirm";
import Input from "@/components/Input";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import { useState } from "react";
import { useCatalogContext } from "@/context/CatalogContext";
import { useTranslations } from "next-intl";
import { remove } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ENV } from "@/typescript/types/api";
import { Link } from "@/navigation";

const Card = ({ name, _id }: DatasetProps) => {
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [catalogName, setCatalogName] = useState(name);
  const { updateDataset, fetchDatasets } = useCatalogContext();
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  const submitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateDataset(_id, catalogName);
    } catch (error) {
      console.error("Error updating dataset:", error);
    } finally {
      setShowPopupEdit(false);
    }
  };

  const dataSetId = _id;
  const submitDelete = async () => {
    if (_id) {
      const response = await remove("datasets", dataSetId, ENV.BOX);
      if (response.statusCode === 200) {
        setShowPopupDelete(false);
        notify(`${dict("toast.success_delete_catalog")}`);
        fetchDatasets();
      } else {
        notifyError(`${dict("toast.error_catalog")}`);
      }
    }
  };

  return (
    <div className={styles.card}>
      <Link href={`/catalog/${_id}`} className={styles.name}>
        {name}
      </Link>
      <div className={styles.btn_container}>
        <Button
          title=''
          styleName='btn_square'
          icon={<Icon name='edit' width={20} height={20} strokeColor='#fff' viewBox='0 0 20 23' />}
          onclick={() => setShowPopupEdit(true)}
        />
        <Button
          title=''
          styleName='btn_square'
          icon={<Icon name='delete' width={20} height={20} strokeColor='#fff' viewBox='0 0 23 22' />}
          onclick={() => setShowPopupDelete(true)}
        />
      </div>
      {showPopupEdit && (
        <PopupChildren
          onConfirm={submitEdit}
          onCancel={() => setShowPopupEdit(false)}
          setShowConfirmation={setShowPopupEdit}
          textCancel={dict("popup.cancel")}
          textAccept={dict("popup.edit")}
        >
          <Input
            type='text'
            textHolder={dict("popup.name")}
            name={dict("popup.name")}
            value={catalogName}
            handleChange={e => setCatalogName(e.target.value)}
          />
        </PopupChildren>
      )}
      {showPopupDelete && (
        <PopupConfirm
          onConfirm={submitDelete}
          onCancel={() => setShowPopupDelete(false)}
          setShowConfirmation={setShowPopupDelete}
          title={dict("popup.delete")}
          textCancel={dict("popup.cancel")}
          textAccept={dict("popup.confirm")}
        />
      )}
    </div>
  );
};

export default Card;
