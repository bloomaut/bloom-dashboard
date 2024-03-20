import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import hotlinkIcon from "/public/icons/hotlink_icon.svg";
import sharedIcon from "/public/icons/share.svg";
import whatsappIcon from "/public/icons/whatsapp.svg";
import copyIcon from "/public/icons/copy.svg";
import closeIcon from "/public/icons/close.svg";
import { useTranslations } from "next-intl";
import { useCloseDropdown } from "@/hooks/useCloseDropdown";
import { useMessageToast } from "@/hooks/useMessageToast";
//Componentes
import Button from "@/components/Button";
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
        <div className={styles.wrapper}>
          <div className={styles.preview}></div>
          <div className={styles.content}>
            <button className={styles.btn_close} onClick={handleCancel}>
              <Image src={closeIcon} className={styles.icon} alt='close-icon' />
            </button>
            <div className={styles.header}>
              <Image src={hotlinkIcon} className={styles.icon} alt='Hotlink Icon' />
              <p className={styles.title}>Hotlink</p>
            </div>
            <div className={styles.link_container}>
              <Link className={styles.link} href={paUrl} target='_blank'>
                {paUrl}
              </Link>
              <Button onclick={handleCopyClick} title={dict("copy")} icon={copyIcon} styleName='btn_copy' />
            </div>
            <Link href={"/"} className={styles.shared_container} target='_blank'>
              <Image src={sharedIcon} className={styles.icon} alt='Hotlink Icon' />
              <p className={styles.text}>{dict("btn")}</p>
              <Image src={whatsappIcon} className={styles.icon} alt='Hotlink Icon' />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopupShare;
