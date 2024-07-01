import styles from "./styles.module.scss";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useTranslations } from "next-intl";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useOpenGraphContext } from "@/context/OpenGraphContext";

interface PopupShareProps {
  setShowPopup: (value: boolean) => void;
}

const PopupShare = ({ setShowPopup }: PopupShareProps) => {
  const { notify, notifyError } = useMessageToast();
  const { dropdownRef } = useCloseDropdown(setShowPopup);
  const dict = useTranslations("dict.playground.popup");
  const { paUrl } = useOpenGraphContext();

  const handleCopyClick = () => {
    if (paUrl)
      navigator.clipboard.writeText(paUrl).then(
        function () {
          notify(`${dict("copy_success")}`);
        },
        function (err) {
          notifyError(`${dict("copy_error")}`);
          console.error("Error al copiar al portapapeles", err);
        },
      );
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <section className={styles.container}>
      <div className={styles.inner_container} ref={dropdownRef}>
        <h2 className={styles.title}>{dict("title")}</h2>
        <div className={styles.content}>
          <button className={styles.btn_close} onClick={handleCancel}>
            <Icon name='close' width={30} height={30} />
          </button>
          <div className={styles.header}>
            <Icon name='hotlink' width={75} height={75} className='hotlink_color' />
            <p className={styles.title}>Hotlink</p>
          </div>
          <div className={styles.link_container}>
            <Link className={styles.link} href={paUrl} target='_blank'>
              {paUrl}
            </Link>
            <div onClick={handleCopyClick} className={styles.btn_copy}>
              <Icon name='copy' width={28} height={28} strokeColor='#7f7f7f' strokeWidth={4} viewBox='0 -5 60 65' />
            </div>
          </div>
          <Link href={"/"} className={styles.shared_container} target='_blank'>
            <Icon name='share' width={22} height={22} strokeColor='#7f7f7f' strokeWidth={4} viewBox='0 -4 50 65' />
            <p className={styles.text}>{dict("btn")}</p>
            <Icon
              name='whatsapp'
              width={22}
              height={22}
              strokeWidth={1}
              strokeColor='#25D366'
              fillColor='#43841A'
              viewBox='0 -2 60 60'
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopupShare;
