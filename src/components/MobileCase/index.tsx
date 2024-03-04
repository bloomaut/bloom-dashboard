"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";

import caseImage from "../../../public/assets/mobileCase.png";

const MobileCase = () => {
  const [iframeSrc, setIframeSrc] = useState("https://notimation.com");
  return (
    <section className={styles.container}>
      <div className={styles.phone}>
        <Image src={caseImage} width={700} height={600} alt='Picture of the author' />
        <iframe src={iframeSrc} width='500' height='500' title='Otra Aplicación'></iframe>
      </div>
    </section>
  );
};

export default MobileCase;
