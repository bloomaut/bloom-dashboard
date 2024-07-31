import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useMessageToast } from "@/hooks/useMessageToast";
import { update } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";

interface Props {
  id: string | string[];
  closePopup: (value: React.SetStateAction<boolean>) => void;
}

const PopupUpdatePrices = ({ id, closePopup }: Props) => {
  const dict = useTranslations("dict");
  const { dropdownRef } = useCloseDropdown(closePopup);
  const { notify, notifyError } = useMessageToast();
  const [closing, setClosing] = useState(false);
  const [percentageValue, setPercentageValue] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentageValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(percentageValue);

    if (!isNaN(numValue) && numValue >= -99 && numValue <= 100) {
      setLoading(true);
      const response = await update("datasets", { percentage: numValue }, `${id}/pricing`, ENV.BOX);
      if (response.statusCode === 200) {
        notify(dict("catalog.price_success"));
      } else {
        notifyError(dict("error.message"));
      }
    } else {
      notifyError(dict("catalog.price_error"));
    }

    setClosing(true);
    setLoading(false);
  };

  return (
    <form className={`${styles.form_container} ${closing && styles.closing}`} onSubmit={handleSubmit}>
      <div className={styles.inner_container} ref={dropdownRef}>
        <div className={styles.btn_close}>
          <button onClick={() => setClosing(true)} type='button'>
            <Icon name='close' width={30} height={30} strokeColor='#7f7f7f' />
          </button>
        </div>
        <header className={styles.header}>
          <p className={styles.title}>{dict("catalog.price_title")}</p>
          <p className={styles.text}>{dict("catalog.price_subtitle")}</p>
        </header>
        <div className={styles.input}>
          <label>{dict("catalog.price_percentage")}</label>
          <input type='text' placeholder='%' name='percentage' value={percentageValue} onChange={handleChange} />
        </div>
        <div className={styles.btn_upload}>
          <Button title='Update' type='submit' loading={loading} />
        </div>
      </div>
    </form>
  );
};

export default PopupUpdatePrices;
