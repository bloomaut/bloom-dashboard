import Image from "next/image";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface FileLogoProps {
  file: File;
}

const FileLogo = ({ file }: FileLogoProps) => {
  const [image, setImage] = useState<string | StaticImport>("");

  useEffect(() => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  }, [file]);

  return (
    <div className={styles.card}>
      <Image src={image} alt='logo' width={150} height={150} />
    </div>
  );
};

export default FileLogo;
