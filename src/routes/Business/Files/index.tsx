"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import FileDragDrop from "./FileDragDrop";
import Subtitle from "../Subtitle";
import FileCard from "./FileCard";

const Files = () => {
  const [files, setFiles] = useState<File[]>();

  return (
    <div className={styles.container}>
      <Subtitle text='Arrojá tus archivos aquí' />
      <FileDragDrop files={files} setFiles={setFiles} />
      <div className={styles.files}>
        {files &&
          files.map(file => (
            <FileCard key={file.name} title={file.name} updated={file.lastModified} docType={file.type} />
          ))}
      </div>
    </div>
  );
};

export default Files;
