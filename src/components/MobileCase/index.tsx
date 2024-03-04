"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";

import styles from "./styles.module.scss";
import caseImage from "../../../public/assets/mobileCase.png";

const MobileCase = () => {
  const [iframeSrc, setIframeSrc] = useState("https://power-app-engine.vercel.app/4b04b0dcd2ade339a3d7ce13252a29d4");
  const [showPreview, setShowPreview] = useState(true);
  const [url, setUrl] = useState("");
  const [previewData, setPreviewData] = useState<any | null>(null);

  const fetchOpenGraphData = async () => {
    let newUrl = encodeURIComponent(url);
    console.log(newUrl);
    try {
      const response = await axios.get(
        `https://opengraph.io/api/1.0/site/${newUrl}?app_id=d46803c3-71c8-405f-8aeb-cd87881ced85`,
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
    fetchOpenGraphData();
  };

  const handlePreviewClick = () => {
    setShowPreview(false);
  };

  return (
    <section className={styles.container}>
      <div>
        <form onSubmit={handleSubmit}>
          <input type='text' value={url} onChange={handleChange} placeholder='Enter URL' />
          <button type='submit'>Generate Preview</button>
        </form>
        <br />
      </div>
      <Image src={caseImage} width={550} height={500} alt='Phone case' className={styles.phone} />
      <div className={styles.iframeContainer}>
        {showPreview && previewData && (
          <a href='#' onClick={handlePreviewClick}>
            <div>
              <h2>{previewData.openGraph.title}</h2>
              <p>{previewData.openGraph.description}</p>
              <br />
              <Image src={previewData.openGraph.image.url} width={500} height={250} alt='Preview' />
            </div>
          </a>
        )}
        {/* IFRAME */}
        {!showPreview && <iframe src={iframeSrc} title='Power App'></iframe>}
      </div>
    </section>
  );
};

export default MobileCase;
