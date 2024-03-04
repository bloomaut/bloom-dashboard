"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";

import caseImage from "../../../public/assets/mobileCase.png";

const MobileCase = () => {
  const [iframeSrc, setIframeSrc] = useState("https://notimation.com");
  return (
    <section className={styles.container}>
      <Image src={caseImage} width={550} height={500} alt='Phone case' className={styles.phone} />
      <iframe src={iframeSrc} width='500' height='500' title='Otra Aplicación'></iframe>
    </section>
  );
};

export default MobileCase;
