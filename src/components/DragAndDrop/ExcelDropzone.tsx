import { Dispatch, SetStateAction } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useMessageToast } from "@/hooks/useMessageToast";
import styles from "./styles.module.scss";
import Icon from "../Icon";
import { useTranslations } from "next-intl";

interface ExcelDropzoneProps {
  file?: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
}

const ExcelDropzone = ({ file, setFile }: ExcelDropzoneProps) => {
  const { notifyError } = useMessageToast();
  const dict = useTranslations("dict.draganddrop");

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const errorCode = fileRejections[0].errors[0].code;
      if (errorCode === "file-invalid-type") {
        notifyError(dict("invalid_file"));
      } else if (errorCode === "too-many-files") {
        notifyError(dict("file_length"));
      }
    } else if (acceptedFiles.length > 0) {
      const fileType = acceptedFiles[0].type;
      if (
        fileType === "application/vnd.ms-excel" ||
        fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(acceptedFiles[0]);
      } else {
        notifyError(dict("error_excel"));
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls", ".xlsx"],
    },
    maxFiles: 1,
  });

  const containerClass = `${styles.container} ${styles.container_excel} ${isDragActive ? styles.isActive : ""}`;

  return (
    <div {...getRootProps()} className={containerClass}>
      <input {...getInputProps()} />
      <Icon name='excel' width={35} height={35} viewBox='0 0 25 30' />
      {file ? (
        <p className={styles.excel_name}>{file.name}</p>
      ) : (
        <p className={styles.text_default}>{dict("text_excel")}</p>
      )}
    </div>
  );
};

export default ExcelDropzone;
