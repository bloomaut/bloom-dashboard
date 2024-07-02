import styles from "./styles.module.scss";
import Link from "next/link";
import { useFlakesContext } from "@/context/FlakesContext";
import { HotlinkList } from "@/typescript/interfaces/hotlink.interface";
import { useState } from "react";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import PopupInfo from "../PopupInfo";

interface TableRowProps {
  hotlink: HotlinkList;
}

const TableRow = ({ hotlink }: TableRowProps) => {
  const { id, setId } = useFlakesContext();
  const [selected, setSelected] = useState(false);
  const [openInfoPopup, setOpenInfoPopup] = useState(false);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict.playground.popup");

  const baseUrlEngine = "https://power-app-engine.vercel.app"; // TODO: haremos esta URL dinámica con un ENV y/o con un sobdomain dependiendo el cliente

  const handleClick = () => {
    setId(hotlink.id);
    setSelected(true);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(`${baseUrlEngine}/${hotlink.hash}`).then(
      function () {
        notify(`${dict("copy_success")}`);
      },
      function (err) {
        notifyError(`${dict("copy_error")}`);
        console.error("Error al copiar al portapapeles", err);
      },
    );
  };

  const handleOpenInfoPopup = () => {
    setOpenInfoPopup(!openInfoPopup);
  };

  return (
    <>
      <div className={`${styles.container} ${id === hotlink.id && styles.hotlink_selected}`} onClick={handleClick}>
        <div className={styles.column}>
          <p>
            {hotlink.flake_power_app?.skinx.title} - {hotlink.flake_power_app?.title}
          </p>
        </div>
        <div className={styles.column}>
          {hotlink.customer ? (
            <>
              {hotlink.customer.clientCode} {hotlink.customer.ClientFirstname} {hotlink.customer.ClientLastname}
            </>
          ) : (
            <em>-</em>
          )}
        </div>
        <div className={styles.column}>
          <Link href={`${baseUrlEngine}/${hotlink.hash}`} target='_blank' className={styles.hotlink_url}>
            {`${baseUrlEngine}/${hotlink.hash}`}
          </Link>
        </div>
        <div className={`${styles.column} ${styles.btn}`}>
          <button className={styles.info} onClick={handleOpenInfoPopup}>
            <Icon
              name='lightning'
              width={35}
              height={35}
              strokeColor='#7f7f7f'
              strokeWidth={1}
              viewBox='2.6 -2 10 20'
            />
          </button>
          <button onClick={handleCopyClick}>
            <Icon name='copy' width={28} height={28} strokeColor='#7f7f7f' strokeWidth={4} viewBox='0 0 60 65' />
          </button>
        </div>
      </div>
      {openInfoPopup && (
        <PopupInfo setShowConfirmation={handleOpenInfoPopup} title='Hotlink Info' hotlinkInfo={hotlink.variables} />
      )}
    </>
  );
};

export default TableRow;
