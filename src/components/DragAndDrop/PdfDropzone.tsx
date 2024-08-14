import { Dispatch, SetStateAction } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useMessageToast } from "@/hooks/useMessageToast";
import styles from "./styles.module.scss";
import Icon from "../Icon";

interface PdfDropzoneProps {
  file?: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
}

const PdfDropzone = ({ file, setFile }: PdfDropzoneProps) => {
  const { notifyError } = useMessageToast();

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const errorCode = fileRejections[0].errors[0].code;
      if (errorCode === "file-invalid-type") {
        notifyError("El tipo de archivo que estas seleccionando no está permitido");
      } else if (errorCode === "too-many-files") {
        notifyError("Solo se permite subir un archivo");
      }
    } else if (acceptedFiles[0].type.includes("application/pdf")) {
      setFile(acceptedFiles[0]);
    } else {
      notifyError("Debes seleccionar un archivo PDF");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const containerClass = `${styles.container} ${isDragActive ? styles.isActive : ""}`;

  return (
    <div {...getRootProps()} className={containerClass}>
      <input {...getInputProps()} />
      <Icon name='pdf' width={35} height={35} viewBox='0 0 25 30' />
      <p className={styles.text}>{file ? <span>{file.name}</span> : <span>Subir o arrastrar un archivo PDF</span>}</p>
    </div>
  );
};

export default PdfDropzone;
