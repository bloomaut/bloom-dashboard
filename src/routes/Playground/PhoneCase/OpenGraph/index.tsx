"use client";
import styles from "./styles.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface OpenGraphProps {
  handlePreviewClick: () => void;
  previewData: any;
  captureTime: string;
}

const OpenGraph = ({ handlePreviewClick, previewData, captureTime }: OpenGraphProps) => {
  const dict = useTranslations("dict.playground.phoneCase");

  return (
    <button onClick={handlePreviewClick} className={styles.container}>
      <div className={styles.date}>
        <p>{dict("today")}</p>
      </div>
      <div className={styles.message}>
        <Image src={previewData.image} width={180} height={120} alt='Preview' />
        <div className={styles.og_styles}>
          <h2>{previewData.title}</h2>
          <p>{previewData.description}</p>
        </div>
        <p className={styles.message_date}>{captureTime}</p>
      </div>
    </button>
  );
};

export default OpenGraph;
