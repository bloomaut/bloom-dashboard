import styles from "./styles.module.scss";
import Image from "next/image";
import folderIcon from "/public/icons/folder.svg";
import trashIcon from "/public/icons/trash.svg";
import folder from "@/../public/icons/folder.svg";
import image from "@/../public/icons/image.svg";
import doc from "@/../public/icons/doc.svg";
import pdf from "@/../public/icons/pdf.svg";
import excel from "@/../public/icons/excel.svg";
import file from "@/../public/icons/file.svg";

interface FileCardProps {
  docType: string;
  title: string;
  updated: number;
  onDelete: () => void;
}

const FileCard = ({ title, docType, updated, onDelete }: FileCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {docType === "folder" && <Image className={styles.icon} alt='folder-icon' src={folder} />}
        {docType.includes("image") && <Image className={styles.icon} alt='image-icon' src={image} />}
        {docType.includes("word") && <Image className={styles.icon} alt='doc-icon' src={doc} />}
        {docType.includes("pdf") && <Image className={styles.icon} alt='pdf-icon' src={pdf} />}
        {docType.includes("sheet") && <Image className={styles.icon} alt='excel-icon' src={excel} />}
        {docType === "else" && <Image className={styles.icon} alt='file-icon' src={file} />}
        <div className={styles.content}>
          <p className={styles.title}>
            File Name: <span>{title}</span>
          </p>
          <p className={styles.updated}>
            Last Updated: <span>{updated}</span>
          </p>
        </div>
      </div>
      <div className={styles.icons}>
        <button className={styles.btn}>
          <Image className={styles.controls_icons} src={folderIcon} alt='folder-icon' />
        </button>
        <button className={styles.btn} onClick={onDelete}>
          <Image className={styles.controls_icons} src={trashIcon} alt='trash-icon' />
        </button>
      </div>
    </div>
  );
};

export default FileCard;
