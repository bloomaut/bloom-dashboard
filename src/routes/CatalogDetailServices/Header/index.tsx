import Button from "@/components/Button";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Form from "../Form";
import { useMessageToast } from "@/hooks/useMessageToast";
import { postFile } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useCatalogServiceContext } from "@/context/CatalogServicesContext";

interface HeaderProps {
  name: string | undefined | null;
  id: string | string[];
  quantity: number | undefined | null;
}

const Header = ({ name, id, quantity }: HeaderProps) => {
  const { loading, setLoading, fetchDatasetById } = useCatalogServiceContext();
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  return (
    <div className={styles.header_container}>
      <div className={styles.title_container}>
        <Breadcrumb />
        <div className={styles.name_container}>
          <p className={styles.name}>{name}</p>
          {!loading && quantity !== null && <p className={styles.quantity}>({quantity})</p>}
        </div>
      </div>
      <div className={styles.btn_container}>
        <Button
          title={dict("catalog.add_service")}
          styleName='btn_add'
          icon={<Icon name='add' viewBox='0 0 20 22' strokeColor='#fff' width={18} height={18} strokeWidth={2} />}
          onclick={() => setShowPopupCreate(true)}
        />
      </div>
      {showPopupCreate && <Form action='post' title={dict("popup.create_product")} setShowPopup={setShowPopupCreate} />}
    </div>
  );
};

export default Header;
