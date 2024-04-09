import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import trashIcon from "/public/icons/trash.svg";
import pencilIcon from "/public/icons/edit.svg";
import PaletteGenerator from "./PaletteGenerator";

interface FileLogoProps {
  file?: File | null;
  onDelete: () => void;
  onEdit: () => void;
}

const FileLogo = ({ file, onEdit, onDelete }: FileLogoProps) => {
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
            {companyLogo ? (
              <button className={styles.btn} onClick={onEdit}>
                <Image className={styles.controls_icons} src={pencilIcon} alt='pencil-icon' />
              </button>
            ) : (
              <button className={styles.btn} onClick={onDelete}>
                <Image className={styles.controls_icons} src={trashIcon} alt='trash-icon' />
              </button>
            )}
          </div>
        </div>
      )}
      {companyLogo && <PaletteGenerator />}
    </div>
  );
};

export default FileLogo;
