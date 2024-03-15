import Image from "next/image";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import trashIcon from "/public/icons/trash.svg";
import LoadingSpinner from "@/components/Loading";
import pdf from "@/../public/icons/pdf.svg";

interface FileLogoProps {
  file?: File;
  onDelete: () => void;
  logoUrl?: string;
  loading: boolean;
}

const FileLogo = ({ file, onDelete, logoUrl, loading }: FileLogoProps) => {
  const [image, setImage] = useState<string | undefined>("");

  useEffect(() => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  }, [file]);

  return (
    <div className={styles.card}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {file ? (
            <>
              {file?.type.includes("pdf") ? (
                <Image src={pdf} className={styles.logoFile} alt='Preview' />
              ) : (
                <img src={image} className={styles.logoFile} alt='Preview' />
              )}
              <p>{file?.name}</p>
              <button className={styles.btn} onClick={onDelete}>
                <Image className={styles.controls_icons} src={trashIcon} alt='trash-icon' />
              </button>
            </>
          ) : (
            logoUrl && (
              <Image src={logoUrl} width={100} height={100} priority className={styles.logoUrl} alt='Logo URL' />
            )
          )}
        </>
      )}
    </div>
  );
};

export default FileLogo;
