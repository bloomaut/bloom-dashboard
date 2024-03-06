"use client";
import Image from "next/image";
import styles from "./styles.module.scss";

interface OpenGraphProps {
  handlePreviewClick: () => void;
  previewData: any;
  captureTime: string;
}

const OpenGraph = ({ handlePreviewClick, previewData, captureTime }: OpenGraphProps) => {
  return (
    <button onClick={handlePreviewClick} className={styles.container}>
      <div className={styles.date}>
        <p>Hoy</p>
      </div>
      <div className={styles.message}>
        <Image src={previewData.openGraph.image.url} width={180} height={120} alt='Preview' />
        <div className={styles.og_styles}>
          <h2>{previewData.openGraph.title}</h2>
          <p>{previewData.openGraph.description}</p>
        </div>
        <p className={styles.message_date}>{captureTime}</p>
      </div>
    </button>
  );
};

export default OpenGraph;
