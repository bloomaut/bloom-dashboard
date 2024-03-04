import { useState } from "react";
import Image from "next/image";
import axios from "axios";

const Opengraph = () => {
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' value={url} onChange={handleChange} placeholder='Enter URL' />
        <button type='submit'>Generate Preview</button>
      </form>
      <br />
      {previewData && (
        <div>
          <h2>{previewData.openGraph.title}</h2>
          <p>{previewData.openGraph.description}</p>
          <br />
          <Image src={previewData.openGraph.image.url} width={500} height={250} alt='Preview' />
        </div>
      )}
    </div>
  );
};

export default Opengraph;
