import styles from "./styles.module.scss";
import Icon from "../Icon";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

interface FileDragDropProps {
  file?: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  img?: "Logo" | "Banner" | "Excel";
}

const DragAndDrop = ({ file, setFile, img }: FileDragDropProps) => {
  const { notifyError } = useMessageToast();
  const userData = useAppSelector(state => state.userData);
  const pathname = usePathname();
  const dict = useTranslations("dict.drag");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Verificar la página actual para aplicar lógica específica
  const businessPage = pathname?.includes("business");
  const myCollectionPage = pathname?.includes("my-collection");
  const catalogPage = pathname?.match(/^\/\w{2}\/catalog\/?$/) !== null;
  const catalogDetail = pathname?.match(/^\/\w{2}\/catalog\/\w+$/) !== null;
  const logo = userData?.client.logo;
  const banner = userData?.client.banner;

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const errorCode = fileRejections[0].errors[0].code;
      if (errorCode === "file-invalid-type") {
        notifyError("El tipo de archivo que estas seleccionando no está permitido");
      } else if (errorCode === "too-many-files") {
        notifyError("Solo se permite subir un archivo");
      }
    } else {
      if (catalogPage) {
        if (!acceptedFiles[0].type.includes("image")) {
          notifyError(dict("error_image"));
        } else {
          setFile(acceptedFiles[0]);
        }
      }

      if (myCollectionPage) {
        if (acceptedFiles[0].type.includes("pdf") || acceptedFiles[0].type.includes("image")) {
          notifyError("Debes seleccionar una planilla de excel");
        } else {
          setFile(acceptedFiles[0]);
        }
      }

      if (catalogDetail) {
        if (img === "Excel") {
          if (acceptedFiles[0].type.includes("pdf") || acceptedFiles[0].type.includes("image")) {
            notifyError("Debes seleccionar una planilla de excel");
          } else {
            setFile(acceptedFiles[0]);
          }
        } else if (img === "Logo") {
          if (acceptedFiles[0].type.includes("pdf") || acceptedFiles[0].type.includes("excel")) {
            notifyError("Debes seleccionar una imagen");
          } else {
            setFile(acceptedFiles[0]);
          }
        } else if (acceptedFiles[0].type.includes("image")) {
          setFile(acceptedFiles[0]);
        } else {
          notifyError(dict("error_image"));
        }
      }

      if (businessPage) {
        if (!acceptedFiles[0].type.includes("image")) {
          notifyError(dict("error_image"));
        } else {
          setFile(acceptedFiles[0]);
        }
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp", ".svg"],
      "application/pdf": [".pdf"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    if (file instanceof File && file.type.includes("image")) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(null);
    }
  }, [file]);

  const containerClass = `${styles.container} ${img === "Excel" ? styles.container_excel : ""} ${
    isDragActive ? styles.isActive : ""
  }`;

  const isFile = (file: any): file is File => {
    return file instanceof File || file instanceof Blob;
  };

  return (
    <div {...getRootProps()} className={containerClass}>
      <input {...getInputProps()} />
      {img === "Excel" ? (
        <Icon name='excel' width={35} height={35} viewBox='0 0 25 30' />
      ) : imageUrl ? (
        <></>
      ) : (
        <Icon name='cloud' viewBox='0 0 33 30' width={30} height={30} strokeWidth={3.18493} strokeColor='#1616a5' />
      )}
      <p className={img === "Excel" ? styles.text_excel : styles.text}>
        {img === "Excel" && file ? (
          <span>{file?.name}</span>
        ) : imageUrl ? (
          <></>
        ) : (
          <>
            <span>{dict("upload")}</span> {dict("drag_drop")}
          </>
        )}
      </p>
      {logo && img === "Logo" && <img src={logo} alt={img ? img : ""} width={300} height={100} />}
      {banner && img === "Banner" && <img src={banner} alt={img ? img : ""} width={300} height={100} />}
      {file && imageUrl ? (
        <img src={imageUrl} alt='Product image' width={100} height={100} />
      ) : isFile(file) ? (
        <img src={URL.createObjectURL(file)} alt='Product image' width={300} height={300} />
      ) : (
        <img src={file as unknown as string} alt='Product image' width={300} height={300} />
      )}
    </div>
  );
};

export default DragAndDrop;
