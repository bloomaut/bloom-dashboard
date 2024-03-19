import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import trashIcon from "/public/icons/trash.svg";

interface FileLogoProps {
  file?: File | null;
  onDelete: () => void;
}

const FileLogo = ({ file, onDelete }: FileLogoProps) => {
  const companyLogo = useAppSelector(data => data.business.logo);
  const [image, setImage] = useState<string | undefined>("");

  useEffect(() => {
    if (file?.type.includes("image")) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    } else {
      setImage(companyLogo);
    }
  }, [file]);

  return (
    <div className={styles.card}>
      {image && <Image src={image} width={100} height={100} priority className={styles.logoUrl} alt='Logo URL' />}
      <p>Paleta de color</p>
      <button className={styles.btn} onClick={onDelete}>
        <Image className={styles.controls_icons} src={trashIcon} alt='trash-icon' />
      </button>
    </div>
  );
};

export default FileLogo;
