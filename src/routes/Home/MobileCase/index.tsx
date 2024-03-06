"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";

import styles from "./styles.module.scss";
import caseImage from "@/../public/assets/mobileCase.png";
import whatsappImage from "@/../public/assets/wa.png";
import OpenGraph from "../OpenGraph";

const MobileCase = () => {
  const [showPreview, setShowPreview] = useState(true);
  const [url, setUrl] = useState("https://power-app-engine.vercel.app/4b04b0dcd2ade339a3d7ce13252a29d4");
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [captureTime, setCaptureTime] = useState<string>("");

  const fetchOpenGraphData = async () => {
    let newUrl = encodeURIComponent(url);
    try {
      const response = await axios.get(
        `https://opengraph.io/api/1.0/site/${newUrl}?app_id=e920319f-bb40-4d46-b146-d3e79df591bc`,
      );
      setPreviewData(response.data);

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching Open Graph data:", error);
    }
  };

  const handleChange = (event: any) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCaptureTime(currentTime);
    setShowPreview(true);
    fetchOpenGraphData();
  };

  const handlePreviewClick = () => {
    setShowPreview(false);
  };

  return (
    <section className={styles.container}>
      <form onSubmit={handleSubmit}>
        <input type='text' value={url} onChange={handleChange} placeholder='Enter URL' />
        <button type='submit'>Generate Preview</button>
      </form>
      <div className={styles.phone_container}>
        <Image src={caseImage} width={550} height={500} alt='Phone case' className={styles.phone} />
        <Image src={whatsappImage} width={250} height={500} alt='Whatsapp' className={styles.wa} />
        <div className={styles.phone_inner_container}>
          {/* OG */}
          {showPreview && previewData && (
            <OpenGraph handlePreviewClick={handlePreviewClick} previewData={previewData} captureTime={captureTime} />
          )}
          {/* IFRAME */}
          {!showPreview && <iframe src={url} title='Power App'></iframe>}
        </div>
      </div>
    </section>
  );
};

export default MobileCase;
