import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import copyIcon from "/public/icons/copy.svg";
import wpIcon from "/public/icons/whatsapp.svg";
import { useFlakesContext } from "@/context/FlakesContext";
import { HotlinkList } from "@/typescript/interfaces/hotlink.interface";
import { useState } from "react";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";

interface TableRowProps {
  hotlink: HotlinkList;
}

const TableRow = ({ hotlink }: TableRowProps) => {
  const { id, setId } = useFlakesContext();
  const [selected, setSelected] = useState(false);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict.playground.popup");

  const handleClick = () => {
    setId(hotlink.id);
    setSelected(true);
  };

  const handleCopyClick = () => {
    if (hotlink.url)
      navigator.clipboard.writeText(hotlink.url).then(
        function () {
          notify(`${dict("copy_success")}`);
        },
        function (err) {
          notifyError(`${dict("copy_error")}`);
          console.error("Error al copiar al portapapeles", err);
        },
      );
  };

  return (
    <div className={`${styles.container} ${id === hotlink.id && styles.hotlink_selected}`} onClick={handleClick}>
      <div className={styles.column}>
        <p>{hotlink.power_app.flake.title}</p>
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
        <Link href={hotlink.url} target='_blank' className={styles.hotlink_url}>
          {hotlink.url}
        </Link>
      </div>
      <div className={styles.column}>
        <button onClick={handleCopyClick}>
          <Image src={copyIcon} width={30} height={30} alt='icon' />
        </button>
        <Image src={wpIcon} width={30} height={30} alt='icon' />
      </div>
    </div>
  );
};

export default TableRow;
