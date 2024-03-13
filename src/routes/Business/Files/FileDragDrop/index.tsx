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
    setFiles(acceptedFiles);
  };

  /* Config of dropzone */
  const { acceptedFiles, getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
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
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className={isDragActive ? `${styles.container} ${styles.isActive}` : styles.container}>
      <input {...getInputProps()} />
      {files ? (
        <>
          {fileRejections[0]?.errors ? (
            <p className={styles.name}>texto</p>
          ) : (
            <>
              {files.map(fil => {
                return (
                  <p className={styles.name} key={fil.name}>
                    {fil.name}
                  </p>
                );
              })}
            </>
          )}
        </>
      ) : (
        <div className={styles.content}>
          <Image src={fileImage} alt='' />
          <p className={styles.text}>Logo</p>
        </div>
      )}
    </div>
  );
};

export default FileDragDrop;
