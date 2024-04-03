"use client";
import styles from "./styles.module.scss";
import { useState } from "react";
import { get, postFile, update, remove } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ENV } from "@/typescript/types/environment.enum";
import { updateLogo } from "@/store/features/businessSlice";
import { useTranslations } from "next-intl";
import { setFilesData } from "@/store/features/filesSlice";
//Componentes
import FileDragDrop from "./FileDragDrop";
import Subtitle from "../Subtitle";
import FileCard from "./FileCard";
import FileLogo from "./FileLogo";
import Button from "@/components/Button";
import PopupConfirm from "@/components/PopupConfirm";

interface FilesProps {
  fetchData: () => void;
}

const Files = ({ fetchData }: FilesProps) => {
  const companyLogo = useAppSelector(data => data.business.logo);
  const reduxFiles = useAppSelector(data => data.files.media);
  const [file, setFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<null | string>(null);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const { notify, notifyError } = useMessageToast();
  const dict = useTranslations("dict");
  const dispatch = useAppDispatch();

  const handleUpdateLogo = async (logoUrl: string) => {
    try {
      const dataToSend = {
        logo: logoUrl,
      };
      await update("small-business", ENV.DASH, dataToSend);
      notify(`${dict("toast.success_img")}`);
      dispatch(updateLogo(logoUrl));
    } catch (error) {
      console.log(error);
      notifyError(`${dict("toast.error_img")}`);
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      const response = await postFile("small-files/media", file, ENV.DASH);
      if (response.data.statusCode === 201) {
        setFile(null);
        if (response.data.result.media.filetype.startsWith("image/")) {
          const logoUrl = response.data.result.media.url;
          await handleUpdateLogo(logoUrl);
        } else {
          notify(`${dict("toast.success_file")}`);
          const userFiles = await get("small-files/media", ENV.DASH);
          dispatch(setFilesData(userFiles.result.folder));
        }
      } else {
        notifyError(`${dict("toast.error_img")}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFile = async () => {
    if (selectedFile) {
      try {
        const response = await remove("small-files/media", selectedFile, ENV.DASH);
        if (response.statusCode === 200) {
          setShowPopupDelete(false);
          notify(`${dict("toast.success_delete")}`);
          fetchData();
        }
      } catch (e) {
        notifyError(`${dict("toast.error_file")}`);
        console.log(e);
      }
    }
  };

  const deleteLogo = () => {
    if (file) {
      setFile(null);
    } else {
      deleteFile();
    }
  };

  return (
    <div className={styles.container}>
      <Subtitle text={!companyLogo ? `${dict("business.file.title01")}` : `${dict("business.file.title02")}`} />
      <FileDragDrop setFile={setFile} />

      {/* Muestra siempre el logo*/}
      {(companyLogo || file) && <FileLogo file={file} onDelete={deleteLogo} />}
      {/* Muestra otros tipos de archivos cuando se cargan */}
      {file && file.type.includes("pdf") && (
        <FileCard
          title={file.name}
          created_at={new Date().toString()}
          docType={file.type}
          onDelete={() => setFile(null)}
        />
      )}
      {/* EL botón aparece cuando se carga una imagen */}
      {file && (
        <div className={styles.btn_container}>
          <Button title='Subir' onclick={() => handleUploadFile(file)} />
        </div>
      )}

      <Subtitle text={`${dict("business.file.subtitle")}`} />
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
              onDelete={() => {
                setSelectedFile(file._id), setShowPopupDelete(true);
              }}
            />
          ))}
        {showPopupDelete && (
          <PopupConfirm
            onConfirm={deleteFile}
            onCancel={() => setShowPopupDelete(false)}
            setShowConfirmation={setShowPopupDelete}
            title={dict("popup.delete_title")}
            textCancel={dict("popup.cancel")}
            textAccept={dict("popup.confirm")}
          />
        )}
      </div>
    </div>
  );
};

export default Files;
