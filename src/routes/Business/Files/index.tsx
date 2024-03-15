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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ENV } from "@/typescript/types/environment.enum";
import { updateLogo } from "@/store/features/businessSlice";

const Files = () => {
  const companyLogo = useAppSelector(data => data.business.logo);
  const reduxFiles = useAppSelector(data => data.files.media);
  const [file, setFile] = useState<File | null>(null);
  const { notify, notifyError } = useMessageToast();
  const dispatch = useAppDispatch();

  console.log(file);

  const handleUpdateLogo = async (logoUrl: string) => {
    try {
      const dataToSend = {
        logo: logoUrl,
      };
      await update("small-business", dataToSend, ENV.DASH);
      notify("Imagen subida correctamente");
      dispatch(updateLogo(logoUrl));
    } catch (error) {
      notifyError("Hubo un error al cargar la imagen");
    }
  };

  const handleUploadFile = async (file: File) => {
    const response = await postFile("small-files/media", file, ENV.DASH);

    if (response.data.statusCode === 201) {
      if (response.data.result.media.filetype.startsWith("image/")) {
        const logoUrl = response.data.result.media.url;
        await handleUpdateLogo(logoUrl);
      } else {
        notify("Archivo subido correctamente");
      }
    } else {
      notifyError("Hubo un error al cargar la imagen");
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const deleteFile = () => {
    //borrar archivo con API
  };

  const deleteLogo = () => {
    if (file) {
      setFile(null);
    } else {
      //borrar logo con API
    }
  };

  return (
    <div className={styles.container}>
      <Subtitle text={!companyLogo ? "Subí tu logo para iniciar" : "Arrojá tus archivos aquí"} />
      <FileDragDrop setFile={setFile} />

      {/* Muestra siempre el logo*/}
      <FileLogo file={file} onDelete={deleteLogo} />
      {/* Muestra otros tipos de archivos cuando se cargan */}
      {file && file.type.includes("pdf") && (
        <FileCard title={file.name} created_at={new Date().toString()} docType={file.type} onDelete={removeFile} />
      )}
      {/* EL botón aparece cuando se carga una imagen */}
      {file && (
        <div className={styles.btn_container}>
          <Button title='Subir' onclick={() => handleUploadFile(file)} />
        </div>
      )}

      <Subtitle text={"Mis archivos"} />
      <div className={styles.files}>
        {/* Muestra todos los archivos PDF */}
        {reduxFiles
          ?.filter(i => i.filetype.includes("pdf"))
          .map(file => (
            <FileCard
              key={file._id}
              title={file.filename}
              created_at={file.created_at}
              docType={file.filetype}
              onDelete={deleteFile}
            />
          ))}
      </div>
    </div>
  );
};

export default Files;
