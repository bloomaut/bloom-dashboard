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
  const { notifyError } = useMessageToast();
  const companyLogo = useAppSelector(data => data.business.logo);

  const onDrop = (acceptedFiles: File[], fileRejections: any) => {
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
        notifyError("La primera carga debe ser una imágen");
      } else {
        setFile(acceptedFiles[0]);
      }
    }
  };

  /* Config of dropzone */
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
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
      {file ? <Image src={fileImage} alt='cloud-icon' /> : <Image src={fileImage} alt='cloud-icon' />}
    </div>
  );
};

export default FileDragDrop;
