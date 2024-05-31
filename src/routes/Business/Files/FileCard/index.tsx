import styles from "./styles.module.scss";
import useFormattedDate from "@/hooks/useFormattedDate";
import Link from "next/link";
import Icon from "@/components/Icon";

interface FileCardProps {
  docType: string;
  title: string;
  created_at: string;
  onDelete?: () => void;
  url?: string;
}

const FileCard = ({ title, docType, created_at, onDelete, url }: FileCardProps) => {
  const date = Date.parse(created_at);
  const formattedDate = useFormattedDate(date);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {docType === "folder" && <Icon name='folder' width={52} height={52} />}
        {docType.includes("image") && <Icon name='image' viewBox='0 0 50 50' />}
        {docType.includes("word") && <Icon name='doc' viewBox='0 0 50 50' />}
        {docType.includes("pdf") && <Icon name='pdf' viewBox='0 0 50 50' />}
        {docType.includes("sheet") && <Icon name='excel' />}
        {docType === "else" && <Icon name='file' viewBox='0 0 50 50' />}
        <div className={styles.content}>
          <p className={styles.title}>
            File Name: <span>{title}</span>
          </p>
          <p className={styles.updated}>
            Last Updated: <span>{formattedDate}</span>
          </p>
        </div>
      </div>
      <div className={styles.icons}>
        {url && (
          <Link href={url} target='_blank' className={styles.btn}>
            <Icon name='folder' width={30} height={30} viewBox='0 0 25 22' />
          </Link>
        )}
        <button className={styles.btn} onClick={onDelete}>
          <Icon name='trash' viewBox='0 0 25 25' />
        </button>
      </div>
    </div>
  );
};

export default FileCard;
