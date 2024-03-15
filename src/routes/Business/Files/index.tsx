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
import { useAppSelector } from "@/store/hooks";
import { ENV } from "@/typescript/types/environment.enum";
import LoadingSpinner from "@/components/Loading";

interface FilesProps {
  handleFetch: () => void;
  loading: boolean;
}

const Files = ({ handleFetch, loading }: FilesProps) => {
  const companyLogo = useAppSelector(data => data.business.logo);
  const [previewLogo, setPreviewLogo] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const { notify, notifyError } = useMessageToast();

  const handleDeleteFile = (fileNameToDelete: string) => {
    const updatedFiles = files?.filter(file => file.name !== fileNameToDelete);
    setFiles(updatedFiles);
  };

  const handleDeleteLogo = () => {
    setPreviewLogo(null);
  };

  const handleUploadLogo = async (logoUrl: string) => {
    try {
      const dataToSend = {
        logo: logoUrl,
      };
      await update("small-business", ENV.DASH, dataToSend);
      notify("Imagen subida correctamente");
      setPreviewLogo(null);
      handleFetch();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  // const handleUploadFiles = async () => {
  //   try {
  //     const response = await postFile("small-files/media", files, ENV.DASH);
  //     console.log(response);
  //     if (response.data.statusCode === 201) {
  //       notify("Archivos subidos correctamente");
  //     } else {
  //       notifyError("Error al subir los archivos");
  //     }
  //   } catch (error) {
  //     console.error("Error al enviar los archivos:", error);
  //   }
  // };

  const handleSubmit = async () => {
    if (previewLogo) {
      try {
        const response = await postFile("small-files/media", previewLogo, ENV.DASH);
        if (response.data.statusCode === 201) {
          const logoUrl = response.data.result.media.url;
          await handleUploadLogo(logoUrl);
        } else {
          notifyError("Error al subir la imagen");
        }
      } catch (error) {
        console.error("Error al enviar la imagen:", error);
      }
    } else {
      // handleUploadFiles();
    }
  };

  return (
    <div className={styles.container}>
      <Subtitle
        text={previewLogo || companyLogo ? "Actualizá tu Logo o arrojá tus PDF aquí" : "Subí tu logo para iniciar"}
      />
      <FileDragDrop
        files={files}
        setFiles={setFiles}
        previewLogo={previewLogo}
        setPreviewLogo={setPreviewLogo}
        companyLogo={companyLogo}
      />
      <div className={styles.files}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {companyLogo && !previewLogo ? (
              <FileLogo logoUrl={companyLogo} onDelete={handleDeleteLogo} loading={loading} />
            ) : previewLogo ? (
              <FileLogo file={previewLogo} onDelete={handleDeleteLogo} loading={loading} />
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
        {files.length > 0 || previewLogo ? (
          <div className={styles.btn_container}>
            <Button title='Enviar' onclick={handleSubmit} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Files;
