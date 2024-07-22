import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useState, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";
//Components
import Button from "@/components/Button";
import Table from "./Table";
import Title from "@/components/Title";

interface Props {
  title: string;
  products: any;
  setShowConfirmation: (value: SetStateAction<boolean>) => void;
}

const ProductsPopup = ({ title, products, setShowConfirmation }: Props) => {
  const { dropdownRef } = useCloseDropdown(setShowConfirmation);
  const [closing, setClosing] = useState(false);
  const dict = useTranslations("dict.business.my-powerapp");
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      //onCancel();
    }, 300);
  };

  return (
    <section className={`${styles.popup_container} ${closing && styles.closing}`}>
      <div className={styles.container} ref={dropdownRef}>
        <Title text={`${dict("catalog")} ${title}`} />
        <Table />
        <div className={styles.btn}>
          <Button title={dict("button_go_edit")} styleName='btn_edit' />
        </div>
      </div>
    </section>
  );
};

export default ProductsPopup;
