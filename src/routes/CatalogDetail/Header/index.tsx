import Button from "@/components/Button";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Form from "../Form";

interface Header {
  name: string;
}

const Header = ({ name }: Header) => {
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const dict = useTranslations("dict.catalog");

  return (
    <div className={styles.header_container}>
      <div className={styles.title_container}>
        <Breadcrumb />
        <p className={styles.catalog}>{name}</p>
      </div>
      <div className={styles.btn_container}>
        <Button
          title={dict("massive_upload")}
          styleName='btn_upload'
          icon={<Icon name='arrow_upload' strokeColor='#7f7f7f' width={25} height={25} viewBox='0 -5 30 30' />}
        />
        <Button
          title={dict("add_product")}
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
