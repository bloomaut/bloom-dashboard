"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import FileDragDrop from "./FileDragDrop";
import Subtitle from "../Subtitle";
import FileCard from "./FileCard";
import FileLogo from "./FileLogo";
import Button from "@/components/Button";
import { postFile, update } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ENV } from "@/typescript/types/environment.enum";
import LoadingSpinner from "@/components/Loading";

interface FilesProps {
  handleFetch: () => void;
  loading: boolean;
}

const Files = ({ handleFetch, loading }: FilesProps) => {
  const business = useAppSelector(data => data.business);
  const [logo, setLogo] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const { notify, notifyError } = useMessageToast();

  const handleDeleteFile = (fileNameToDelete: string) => {
    const updatedFiles = files?.filter(file => file.name !== fileNameToDelete);
    setFiles(updatedFiles);
  };

  const handleDeleteLogo = () => {
    setLogo(null);
  };

  const handleUploadLogo = async (logoUrl: string) => {
    try {
      const dataToSend = {
        logo: logoUrl,
      };
      await update("small-business", ENV.DASH, dataToSend);
      notify("Imagen subida correctamente");
      setLogo(null);
      handleFetch();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleSubmit = async () => {
    if (logo) {
      try {
        const response = await postFile("small-files/media", logo, ENV.DASH);
        if (response.data.statusCode === 201) {
          const logoUrl = response.data.result.media.url;
          await handleUploadLogo(logoUrl);
        } else {
          notifyError("Error al subir la imagen");
        }
      } catch (error) {
        console.error("Error al enviar la imagen:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Subtitle text={logo || business.logo ? "Arrojá tus archivos aquí" : "Subí tu logo para iniciar"} />
      <FileDragDrop files={files} setFiles={setFiles} logo={logo} setLogo={setLogo} />
      <div className={styles.files}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {business.logo && !logo ? (
              <FileLogo logoUrl={business.logo} onDelete={handleDeleteLogo} loading={loading} />
            ) : logo ? (
              <FileLogo file={logo} onDelete={handleDeleteLogo} loading={loading} />
            ) : null}
          </>
        )}
        {files &&
          files.map(file => (
            <FileCard
              key={file.name}
              title={file.name}
              updated={file.lastModified}
              docType={file.type}
              onDelete={() => handleDeleteFile(file.name)}
            />
          ))}
        {files.length > 0 || logo ? (
          <div className={styles.btn_container}>
            <Button title='Enviar' onclick={handleSubmit} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Files;
