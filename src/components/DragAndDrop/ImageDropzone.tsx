import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";
import Icon from "../Icon";

interface ImageDropzoneProps {
  file?: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  currentImage: string | null;
}

const ImageDropzone = ({ file, setFile, currentImage }: ImageDropzoneProps) => {
  const { notifyError } = useMessageToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const dict = useTranslations("dict.draganddrop");

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const errorCode = fileRejections[0].errors[0].code;
      if (errorCode === "file-invalid-type") {
        notifyError(dict("invalid_file"));
      } else if (errorCode === "too-many-files") {
        notifyError(dict("file_length"));
      } else if (errorCode === "file-too-large") {
        notifyError(dict("file_size_error"));
      }
    } else if (acceptedFiles[0].type.includes("image")) {
      setFile(acceptedFiles[0]);
    } else {
      notifyError(dict("error_image"));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp", ".svg"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  useEffect(() => {
    if (file instanceof File && file.type.includes("image")) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(currentImage || null);
    }
  }, [file, currentImage]);

  const containerClass = `${styles.container} ${isDragActive ? styles.isActive : ""}`;

  return (
    <div {...getRootProps()} className={containerClass}>
      <input {...getInputProps()} />
      {imageUrl ? (
        <img src={imageUrl} alt={"image"} width={100} height={100} />
      ) : (
        <Icon name='cloud' viewBox='0 0 33 30' width={30} height={30} strokeWidth={3.18493} strokeColor='#1616a5' />
      )}
      <p className={styles.text}>{!imageUrl && <span>{dict("text_image")}</span>}</p>
    </div>
  );
};

export default ImageDropzone;
