import styles from "./styles.module.scss";
import Link from "next/link";
import { useFlakesContext } from "@/context/FlakesContext";
import { HotlinkList } from "@/typescript/interfaces/hotlink.interface";
import { useState } from "react";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";

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
        <p>{hotlink.power_app?.flake?.title}</p>
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
          <Icon name='copy' width={28} height={28} strokeColor='#7f7f7f' strokeWidth={4} viewBox='0 0 60 65' />
        </button>
        <Icon
          name='whatsapp'
          width={28}
          height={28}
          strokeWidth={1}
          strokeColor='#7f7f7f'
          fillColor='#7f7f7f'
          viewBox='0 0 60 65'
        />
      </div>
    </div>
  );
};

export default TableRow;
