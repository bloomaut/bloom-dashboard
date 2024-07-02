import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppSelector } from "@/store/hooks";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Icon from "../Icon";

interface FileDragDropProps {
  file?: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
}

const DragAndDrop = ({ file, setFile }: FileDragDropProps) => {
  const { notifyError } = useMessageToast();
  const companyLogo = useAppSelector(data => data);
  const pathname = usePathname();
  const dict = useTranslations("dict.drag");

  console.log(companyLogo);

  const businessPage = pathname?.includes("business");
  const myCollectionPage = pathname?.includes("my-collection");
  const catalogPage = pathname?.includes("catalog");

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
      // Lógica para controlar la carga en my-business
      if (businessPage) {
        // Si no hay logo, la primera carga debe ser una imagen
        if (!companyLogo && acceptedFiles[0].type.includes("pdf")) {
          notifyError("La primera carga debe ser una imagen");
          // Si ya hay logo y se quiere editar, solo se permite seleccionar imagenes
        } else if (companyLogo && (acceptedFiles[0].type.includes("pdf") || acceptedFiles[0].type.includes("sheet"))) {
          notifyError("Debes seleccionar una imagen");
        } else {
          setFile(acceptedFiles[0]);
        }
      }

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

  return (
    <div {...getRootProps()} className={isDragActive ? `${styles.container} ${styles.isActive}` : styles.container}>
      <input {...getInputProps()} />
      <Icon name='cloud' viewBox='0 0 33 30' width={30} height={30} strokeWidth={3.18493} strokeColor='#1616a5' />
      <p className={styles.text}>
        <span>{dict("upload")}</span> {dict("drag_drop")}
      </p>
    </div>
  );
};

export default DragAndDrop;
