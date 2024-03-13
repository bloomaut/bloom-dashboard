import Image from "next/image";
import styles from "./styles.module.scss";
import fileImage from "/public/icons/cloud.svg";
import { Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { useMessageToast } from "@/hooks/useMessageToast";

interface FileDragDropProps {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  logo?: File | null;
  setLogo?: Dispatch<SetStateAction<File | null>>;
}

const FileDragDrop = ({ files, setFiles, logo, setLogo }: FileDragDropProps) => {
  const { notify, notifyError } = useMessageToast();

  const onDrop = (acceptedFiles: File[]) => {
    if (!logo) {
      if (acceptedFiles.length > 0 && !acceptedFiles[0].type.startsWith("image/")) {
        notifyError("Debes subir primero el Logo en formato PNG, JPEG, JPG, WEBP ");
        return;
      }
      if (setLogo) {
        setLogo(acceptedFiles[0]);
      }
    } else {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }
  };

  /* Config of dropzone */
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/json": [".json"],
    },
  });

  return (
    <div {...getRootProps()} className={isDragActive ? `${styles.container} ${styles.isActive}` : styles.container}>
      <input {...getInputProps()} />
      {files && files.length > 0 ? (
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
