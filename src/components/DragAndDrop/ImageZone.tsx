import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import styles from "./styles.module.scss";
import Icon from "../Icon";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";

interface ImageDropzoneProps {
  file?: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  currentImage: string | null;
  name?: string | null;
  variableName?: string | null;
  setVariableName?: Dispatch<SetStateAction<string | null>> | null;
}

const ImageZone = ({ file, setFile, currentImage, name, variableName, setVariableName }: ImageDropzoneProps) => {
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
      if (name && setVariableName) {
        setVariableName(name);
      }
    } else {
      notifyError(dict("error_image"));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  useEffect(() => {
    if (file instanceof File && file.type.includes("image")) {
      const url = URL.createObjectURL(file);
      if (!variableName) {
        setImageUrl(url);
      } else if (name === variableName) {
        // Condición para setear la imagen solo en el fileinput correspondiente, para que no aparezca la misma imagen en todos (kev)
        setImageUrl(url);
      }
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(currentImage || null);
    }
  }, [file, currentImage]);

  const containerClass = `${styles.container} ${isDragActive ? styles.isActive : ""}`;

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Upload className='h-12 w-12 mx-auto text-gray-400 mb-4' />
      <p className='text-sm text-gray-600 mb-2'>Logo de la empresa</p>
      <Button variant='outline' size='sm'>
        Subir logo
      </Button>
    </div>
  );
};

export default ImageZone;
