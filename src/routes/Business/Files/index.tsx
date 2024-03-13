"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import FileDragDrop from "./FileDragDrop";
import Subtitle from "../Subtitle";

const Files = () => {
  const [files, setFiles] = useState<File[]>();

  return (
    <div className={styles.container}>
      <Subtitle text='Arrojá tus archivos aquí' />
      <FileDragDrop files={files} setFiles={setFiles} />
    </div>
  );
};

export default Files;
