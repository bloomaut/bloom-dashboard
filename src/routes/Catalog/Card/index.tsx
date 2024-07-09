import Button from "@/components/Button";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import PopupConfirm from "@/components/PopupConfirm";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import { useState } from "react";
import { useCatalogContext } from "@/context/CatalogContext";
import { useLocale, useTranslations } from "next-intl";
import { remove, update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ENV } from "@/typescript/types/api";
import { Link } from "@/navigation";
import Image from "next/image";
import default_product_image from "/public/assets/default_product_image.png";
import FormActions from "../FormActions";
import { useRouter } from "next/navigation";

const Card = ({ _id, name, description, image, totalDataItems }: DatasetProps) => {
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [catalogName, setCatalogName] = useState(name);
  const [loading, setLoading] = useState<boolean>(false);
  const { fetchDatasets } = useCatalogContext();
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");
  const router = useRouter();
  const locale = useLocale();

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
    <article className={styles.container}>
      <div className={styles.card}>
        <Link href={`/catalog/${_id}`} className={styles.image_container}>
          {image ? (
            <Image src={image} className={styles.image} alt={name} width={140} height={140} />
          ) : (
            <Image src={default_product_image} className={styles.default_image} alt={name} width={140} height={140} />
          )}
        </Link>
        <Link href={`/catalog/${_id}`} className={styles.content}>
          <div className={styles.title_container}>
            <h2 className={styles.title} title={name}>
              {name}
            </h2>
            <span>({totalDataItems})</span>
          </div>
        </Link>
        {showPopupEdit && (
          <FormActions
            action='put'
            id={_id}
            name={name}
            description={description}
            image={image}
            fetchDatasets={fetchDatasets}
            setShowConfirmation={setShowPopupEdit}
          />
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
      </div>
      <div className={styles.btn_edit}>
        <Button
          title=''
          styleName='bg_transparent'
          icon={<Icon name='edit' width={25} height={25} strokeWidth={1.3} strokeColor='#fff' viewBox='0 0 20 22' />}
          onclick={() => setShowPopupEdit(true)}
        />
      </div>
    </article>
  );
};

export default Card;
