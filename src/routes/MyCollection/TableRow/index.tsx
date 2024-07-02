import styles from "./styles.module.scss";
import Link from "next/link";
import { HotlinkList } from "@/typescript/interfaces/hotlink.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";

const TableRow = ({ hotlink }: { hotlink: HotlinkList }) => {
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict.playground.popup");

  const baseUrlEngine = process.env.NEXT_PUBLIC_ENGINE_URL; // TODO: haremos esta URL dinámica con un ENV y/o con un sobdomain dependiendo el cliente

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

  return (
    <div className={styles.container}>
      <p className={styles.customer}>{hotlink.customer_id}</p>
      <Link href={`${baseUrlEngine}/${hotlink.hash}`} target='_blank' className={styles.link}>
        {`${baseUrlEngine}/${hotlink.hash}`}
      </Link>
      <div className={styles.share_container}>
        <button onClick={handleCopyClick}>
          <Icon name='copy' width={28} height={28} strokeColor='#7f7f7f' strokeWidth={4} viewBox='0 0 60 65' />
        </button>
      </div>
    </div>
  );
};

export default TableRow;
