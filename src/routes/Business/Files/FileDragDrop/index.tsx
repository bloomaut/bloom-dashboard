import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import fileImage from "/public/icons/cloud.svg";

interface FileDragDropProps {
  setFile: Dispatch<SetStateAction<File | null>>;
}

const FileDragDrop = ({ setFile }: FileDragDropProps) => {
  const { notifyError } = useMessageToast();
  const companyLogo = useAppSelector(data => data.business.logo);

  const onDrop = (acceptedFiles: File[], fileRejections: any) => {
    console.log(acceptedFiles[0]);
    // Si hay errores, manejarlos acá
    if (fileRejections.length) {
      const errorCode = fileRejections[0].errors[0].code;
      if (errorCode === "file-invalid-type") {
        notifyError("Solo se permiten imágenes o documentos PDF");
      } else if (errorCode === "too-many-files") {
        notifyError("Solo se permite subir un archivo");
      }
    } else {
      // Si no hay logo, la primera carga debe ser una imagen
      if (!companyLogo && acceptedFiles[0].type.includes("pdf")) {
        notifyError("La primera carga debe ser una imagen");
      } else {
        setFile(acceptedFiles[0]);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className={isDragActive ? `${styles.container} ${styles.isActive}` : styles.container}>
      <input {...getInputProps()} />
      <Image className={styles.icon} src={fileImage} alt='cloud-icon' />
    </div>
  );
};

export default FileDragDrop;
