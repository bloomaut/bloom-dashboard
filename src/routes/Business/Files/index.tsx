"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import FileDragDrop from "./FileDragDrop";
import Subtitle from "../Subtitle";
import FileCard from "./FileCard";
import FileLogo from "./FileLogo";
import Button from "@/components/Button";
import { postFile } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { setLogoURL } from "@/store/features/businessSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const Files = () => {
  const [logo, setLogo] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const dispatch = useAppDispatch();
  const { notify, notifyError } = useMessageToast();
  const business = useAppSelector(data => data.business);

  const handleDelete = (fileNameToDelete: string) => {
    const updatedFiles = files?.filter(file => file.name !== fileNameToDelete);
    setFiles(updatedFiles);
  };

  const handleSubmit = async () => {
    if (logo) {
      try {
        const response = await postFile("small-files/media", logo, "NEXT_PUBLIC_API_DASH");
        if (response.data.statusCode === 201) {
          notify("Imagen subida correctamente");
          dispatch(setLogoURL(response.data.result.media.url));
        } else {
          notifyError("Error al subir la imagen");
        }
      } catch (error) {
        console.error("Error al enviar la imagen:", error);
      }
    }
  };

  console.log(business.logo);

  return (
    <div className={styles.container}>
      <Subtitle text={logo ? "Arrojá tus archivos aquí" : "Subí tu logo para iniciar"} />
      <FileDragDrop files={files} setFiles={setFiles} logo={logo} setLogo={setLogo} />
      <div className={styles.files}>
        {logo && <FileLogo file={logo} />}
        {files &&
          files.map(file => (
            <FileCard
              key={file.name}
              title={file.name}
              updated={file.lastModified}
              docType={file.type}
              onDelete={() => handleDelete(file.name)}
            />
          ))}
        {files.length > 0 ||
          (logo && (
            <div className={styles.btn_container}>
              <Button title='Enviar' onclick={handleSubmit} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Files;
