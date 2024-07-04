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
import { remove, update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ENV } from "@/typescript/types/api";
import { Link } from "@/navigation";

const Card = ({ name, _id }: DatasetProps) => {
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [catalogName, setCatalogName] = useState(name);
  const [loading, setLoading] = useState<boolean>(false);
  const { fetchDatasets } = useCatalogContext();
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  const submitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const updatedDataset = {
      name: catalogName,
    };
    const response = await update("datasets", updatedDataset, _id, ENV.BOX);
    if (response.statusCode === 200) {
      notify(dict("toast.success_edit"));
      setShowPopupEdit(false);
      setLoading(false);
      fetchDatasets();
    } else {
      notifyError(dict("toast.error_edit"));
    }
  };

  const submitDelete = async () => {
    setLoading(true);
    const response = await remove("datasets", _id, ENV.BOX);
    if (response.statusCode === 200) {
      setShowPopupDelete(false);
      notify(`${dict("toast.success_delete_catalog")}`);
      setLoading(false);
      fetchDatasets();
    } else {
      notifyError(`${dict("toast.error_catalog")}`);
    }
  };

  return (
    <article className={styles.card}>
      <Link href={`/catalog/${_id}`} className={styles.image_container} title={name}>
        {name}
      </Link>
      <div className={styles.content}>
        <div className={styles.title_container}>
          <h2 className={styles.title}>{name}</h2>
        </div>
        <Button
          title=''
          styleName='bg_transparent'
          icon={<Icon name='edit' width={25} height={25} strokeWidth={1.3} strokeColor='#fff' viewBox='0 0 20 22' />}
          onclick={() => setShowPopupEdit(true)}
        />
      </div>
      {showPopupEdit && (
        <PopupChildren
          onConfirm={submitEdit}
          onCancel={() => setShowPopupEdit(false)}
          title={dict("popup.edit_catalog")}
          setShowConfirmation={setShowPopupEdit}
          loading={loading}
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
          loading={loading}
          textCancel={dict("popup.cancel")}
          textAccept={dict("popup.confirm")}
        />
      )}
    </article>
  );
};

export default Card;
