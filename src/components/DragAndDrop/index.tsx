import styles from "./styles.module.scss";
import Icon from "../Icon";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useBusinessContext } from "@/context/BusinessContext";
import excel from "/public/assets/excel_logo.svg";
import Button from "../Button";

interface FileDragDropProps {
  file?: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  img?: "Logo" | "Banner" | "Excel";
}

const DragAndDrop = ({ file, setFile, img }: FileDragDropProps) => {
  const { notifyError } = useMessageToast();
  const { userData } = useBusinessContext();
  const companyLogo = useAppSelector(data => data);
  const pathname = usePathname();
  const dict = useTranslations("dict.drag");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const businessPage = pathname?.includes("business");
  const myCollectionPage = pathname?.includes("my-collection");
  const catalogPage = pathname?.includes("catalog");
  const logo = userData?.client.logo;
  const banner = "";

  const onDrop = (acceptedFiles: File[], fileRejections: any) => {
    // Si hay errores, manejarlos acá
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
          notifyError("Debes seleccionar una imagen");
        } else {
          setFile(acceptedFiles[0]);
        }
      }

      // Lógica para controlar la carga en my-collection
      if (myCollectionPage) {
        // Solo permitir la carga de planillas de excel
        if (acceptedFiles[0].type.includes("pdf") || acceptedFiles[0].type.includes("image")) {
          notifyError("Debes seleccionar una planilla de excel");
        } else {
          setFile(acceptedFiles[0]);
        }
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp"],
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

  return (
    <div {...getRootProps()} className={containerClass}>
      <input {...getInputProps()} />
      {img === "Excel" ? (
        <Icon name='excel' width={35} height={35} viewBox='0 0 25 30' />
      ) : (
        <Icon name='cloud' viewBox='0 0 33 30' width={30} height={30} strokeWidth={3.18493} strokeColor='#1616a5' />
      )}
      <p className={img === "Excel" ? styles.text_excel : styles.text}>
        <span>{dict("upload")}</span> {dict("drag_drop")}
      </p>
      {logo && img === "Logo" && <Image src={logo} alt={img ? img : ""} width={100} height={100} />}
      {file instanceof File
        ? imageUrl && <Image src={imageUrl} alt={file.name} width={100} height={100} />
        : file && <Image src={file} alt='Image' width={300} height={300} />}
      {/* {img === "Excel" && <Image src={excel} width={25} alt='excel' />} */}
    </div>
  );
};

export default DragAndDrop;
