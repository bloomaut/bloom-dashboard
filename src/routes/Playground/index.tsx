"use client";
import { useState } from "react";
import Form from "./Form";
import PhoneCase from "./PhoneCase";
import TemplatesSelector from "./TemplatesSelector";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/Breadcrumb";
import axios from "axios";

const Playground = () => {
  const [url, setUrl] = useState("https://power-app-engine.vercel.app/4b04b0dcd2ade339a3d7ce13252a29d4");
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [captureTime, setCaptureTime] = useState<string>("");
  const [showPreview, setShowPreview] = useState(true);

  const submitForm = (event: any) => {
    event.preventDefault();
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCaptureTime(currentTime);
    setShowPreview(true);
    fetchOpenGraphData();
  };

  const fetchOpenGraphData = async () => {
    const newUrl = encodeURIComponent(url);
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

  const getData = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/opengraph");
      const data = await response.json();
      console.log("si", data);
    } catch (error) {
      console.log("Error fetching Open Graph data:", error);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.breadcrumb_container}>
        <Breadcrumb title={"Simulador"} route={"introduction"} />
      </div>
      <div className={styles.inner_container}>
        <TemplatesSelector />
        <Form setUrl={setUrl} url={url} submitForm={getData} />
        <PhoneCase
          previewData={previewData}
          showPreview={showPreview}
          url={url}
          setShowPreview={setShowPreview}
          captureTime={captureTime}
        />
      </div>
    </section>
  );
};

export default Playground;
