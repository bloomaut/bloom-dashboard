"use client";
import { useState } from "react";
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
  const files = useAppSelector(data => data.files.media);
  const [file, setFile] = useState<File | null>(null);
  const { notify, notifyError } = useMessageToast();

  console.log(file);

  const handleDeletePreview = () => {
    setFile(null);
  };

  const handleUpdateLogo = async (logoUrl: string) => {
    try {
      const dataToSend = {
        logo: logoUrl,
      };
      await update("small-business", dataToSend, ENV.DASH);
      notify("Imagen subida correctamente");
      setFile(null);
      handleFetch();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      const response = await postFile("small-files/media", file, ENV.DASH);

      if (response.data.statusCode === 201) {
        if (response.data.result.media.filetype.startsWith("image/")) {
          const logoUrl = response.data.result.media.url;
          await handleUpdateLogo(logoUrl);
        } else {
          notify("Archivo subido correctamente");
          setFile(null);
          handleFetch();
        }
      }
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Subtitle text={!companyLogo ? "Subí tu logo para iniciar" : "Arrojá tus archivos aquí"} />
      <FileDragDrop file={file} setFile={setFile} />
      {companyLogo && !file ? (
        <FileLogo logoUrl={companyLogo} onDelete={handleDeletePreview} loading={loading} />
      ) : file ? (
        <FileLogo file={file} onDelete={handleDeletePreview} loading={loading} />
      ) : null}
      {file && (
        <div className={styles.btn_container}>
          <Button title='Subir' onclick={() => handleUploadFile(file)} />
        </div>
      )}
      <div className={styles.files}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          files?.map(file => (
            <FileCard key={file._id} title={file.filename} created_at={file.created_at} docType={file.filetype} />
          ))
        )}
      </div>
    </div>
  );
};

export default Files;
