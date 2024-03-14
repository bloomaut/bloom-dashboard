import Image from "next/image";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface FileLogoProps {
  file: File;
}

const FileLogo = ({ file }: FileLogoProps) => {
  const [image, setImage] = useState<string | undefined>("");

  useEffect(() => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  }, [file]);

  return (
    <div className={styles.card}>
      {/* <Image src={image} alt='logo' width={100} height={100} /> */}
      <img src={image} className={styles.logo} />
      <p>Logo</p>
    </div>
  );
};

export default FileLogo;
