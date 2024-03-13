"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import FileDragDrop from "./FileDragDrop";
import Subtitle from "../Subtitle";
import FileCard from "./FileCard";
import FileLogo from "./FileLogo";

const Files = () => {
  const [logo, setLogo] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleDelete = (fileNameToDelete: string) => {
    const updatedFiles = files?.filter(file => file.name !== fileNameToDelete);
    setFiles(updatedFiles);
  };

  return (
    <div className={styles.container}>
      <Subtitle text={logo ? "Arrojá tus archivos aquí" : "Subí tu logo para iniciar"} />
      <FileDragDrop files={files} setFiles={setFiles} logo={logo} setLogo={setLogo} />
      <div className={styles.files}>
        {logo && <FileLogo file={logo} />}
        {files &&
          files.map(file => (
            <FileCard
              key={file.name}
              title={file.name}
              updated={file.lastModified}
              docType={file.type}
              onDelete={() => handleDelete(file.name)}
            />
          ))}
      </div>
    </div>
  );
};

export default Files;
