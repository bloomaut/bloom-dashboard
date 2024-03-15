import Image from "next/image";
import styles from "./styles.module.scss";
import fileImage from "/public/icons/cloud.svg";
import { Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppSelector } from "@/store/hooks";

interface FileDragDropProps {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
}

const FileDragDrop = ({ file, setFile }: FileDragDropProps) => {
  const { notify, notifyError } = useMessageToast();
  const companyLogo = useAppSelector(data => data.business.logo);

  const onDrop = (acceptedFiles: File[]) => {
    console.log(fileRejections);

    if (fileRejections.length) {
    } else {
      // El archivo no tiene errores
      setFile(acceptedFiles[0]);
    }

    if (!companyLogo && acceptedFiles.length === 1 && acceptedFiles[0].type.startsWith("image")) {
      setFile(acceptedFiles[0]);
    } else if (
      acceptedFiles.length === 1 &&
      !acceptedFiles[0].type.includes("pdf") &&
      !acceptedFiles[0].type.startsWith("image")
    ) {
      notifyError("Solo se permiten imágenes o documentos PDF");
    } else if (
      acceptedFiles.length === 1 &&
      (acceptedFiles[0].type === "application/pdf" || acceptedFiles[0].type.startsWith("image"))
    ) {
      setFile(acceptedFiles[0]);
    } else if (acceptedFiles.length === 0) {
      notifyError("Solo se permite subir un archivo");
    } else {
      notifyError("Debes subir una imagen como logo o un PDF para archivos");
    }
  };

  /* Config of dropzone */
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp"],
      "application/pdf": [".pdf"],
      /* "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
      "application/json": [".json"], */
    },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className={isDragActive ? `${styles.container} ${styles.isActive}` : styles.container}>
      <input {...getInputProps()} />
      {file ? (
        fileRejections[0]?.errors ? (
          <p className={styles.name}>Error</p>
        ) : (
          <Image src={fileImage} alt='cloud-icon' />
        )
      ) : (
        <Image src={fileImage} alt='cloud-icon' />
      )}
    </div>
  );
};

export default FileDragDrop;
