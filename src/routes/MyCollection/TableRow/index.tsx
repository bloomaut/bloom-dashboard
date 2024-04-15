import styles from "./styles.module.scss";
import copyIcon from "/public/icons/copy.svg";
import wpIcon from "/public/icons/whatsapp.svg";
import Image from "next/image";
import Link from "next/link";
import { HotlinkList } from "@/typescript/interfaces/hotlink.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";

const TableRow = ({ hotlink }: { hotlink: HotlinkList }) => {
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict.playground.popup");
  console.log(hotlink);

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
    <div className={styles.container}>
      <p className={styles.customer}>{hotlink.customer_id}</p>
      <Link href={hotlink.url} target='_blank' className={styles.link}>
        {hotlink.url}
      </Link>
      <div className={styles.share_container}>
        <button className={styles.btn} onClick={handleCopyClick}>
          <Image src={copyIcon} width={30} height={30} alt='icon' />
        </button>
        <button className={styles.btn}>
          <Image src={wpIcon} width={30} height={30} alt='icon' />
        </button>
      </div>
    </div>
  );
};

export default TableRow;
