import Image from "next/image";
import styles from "./styles.module.scss";
import fileImage from "/public/icons/cloud.svg";
import { useDropzone } from "react-dropzone";

interface StepsProps {
  files: File[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

const FileDragDrop = ({ files, setFiles }: StepsProps) => {
  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prevFiles => (prevFiles ? [...prevFiles, ...acceptedFiles] : acceptedFiles));
  };

  /* Config of dropzone */
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/json": [".json"],
    },
  });

  const lastFileName = files && files.length > 0 ? files[files.length - 1].name : "";

  return (
    <div {...getRootProps()} className={isDragActive ? `${styles.container} ${styles.isActive}` : styles.container}>
      <input {...getInputProps()} />
      {files ? (
        <>{fileRejections[0]?.errors ? <p className={styles.name}>Error</p> : <p>{lastFileName}</p>}</>
      ) : (
        <div className={styles.content}>
          <Image src={fileImage} alt='cloud-icon' />
        </div>
      )}
    </div>
  );
};

export default FileDragDrop;
