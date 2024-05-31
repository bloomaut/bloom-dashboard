import styles from "./styles.module.scss";
import Image from "next/image";
import PaletteGenerator from "./PaletteGenerator";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
// Components
import Button from "@/components/Button";
import Icon from "@/components/Icon";

interface FileLogoProps {
  file?: File | null;
  onDelete: () => void;
  onEdit: () => void;
  onUpdate: (file: File) => void;
}

const FileLogo = ({ file, onEdit, onUpdate, onDelete }: FileLogoProps) => {
  const companyLogo = useAppSelector(data => data.business.logo);
  const [image, setImage] = useState<string | undefined>("");

  useEffect(() => {
    if (file?.type.includes("image")) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    } else {
      setImage(companyLogo);
    }
  }, [file, companyLogo]);

  return (
    <div className={companyLogo ? `${styles.card_flex} ${styles.card_grid}` : `${styles.card_flex}`}>
      {image && (
        <div className={styles.logo_container}>
          <p>Company Logo</p>
          <Image src={image} width={100} height={100} priority className={styles.logo} alt='Logo' />
          <div className={styles.btn_container}>
            {companyLogo && !file ? (
              <button className={styles.btn} onClick={onEdit}>
                <Icon name='edit' viewBox='0 0 25 20' />
              </button>
            ) : (
              file && (
                <>
                  <button className={styles.btn} onClick={onDelete}>
                    <Icon name='trash' viewBox='0 0 25 25' />
                  </button>
                  <Button title='Subir' onclick={() => onUpdate(file)} />
                </>
              )
            )}
          </div>
        </div>
      )}
      {companyLogo && <PaletteGenerator />}
    </div>
  );
};

export default FileLogo;
