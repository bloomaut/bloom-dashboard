import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useFlakesContext } from "./FlakesContext";

interface Context {
  setTime: () => void;
  captureTime: string;
  setShowPreview: (i: boolean) => void;
  showPreview: boolean;
  previewData: any;
  paUrl: string;
  setPaUrl: (url: string) => void;
  setLoadingDots: (i: boolean) => void;
  loadingDots: boolean;
}

const OpenGraphContext = createContext<Context>({
  // eslint-disable-next-line no-empty-function
  setTime: () => {},
  captureTime: "",
  setShowPreview: () => true,
  showPreview: true,
  previewData: null,
  paUrl: "",
  setPaUrl: () => "",
  setLoadingDots: () => false,
  loadingDots: false,
});

export const OpenGraphProvider = ({ children }: { children: JSX.Element }) => {
  const { selectedFlakeId } = useFlakesContext();
  const [captureTime, setCaptureTime] = useState<string>("");
  const [showPreview, setShowPreview] = useState(true);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [paUrl, setPaUrl] = useState("");
  const [loadingDots, setLoadingDots] = useState(false);

  const setTime = () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCaptureTime(currentTime);
  };

  useEffect(() => {
    const fetchOpenGraphData = async () => {
      const newUrl = encodeURIComponent(paUrl);
      try {
        const response = await axios.get(
          `https://opengraph.io/api/1.1/site/${newUrl}?app_id=8d7e1216-c72f-45af-bc0e-f53540b96aa2`,
        );
        setPreviewData(response.data);
      } catch (error) {
        console.error("Error fetching Open Graph data:", error);
      }
    };
    if (paUrl !== "") {
      fetchOpenGraphData();
    }
  }, [paUrl]);

  // Si se selecciona otro template, se reinicia todo
  const resetForm = () => {
    setShowPreview(true);
    setPreviewData(null);
    setPaUrl("");
    setCaptureTime("");
  };

  useEffect(() => {
    resetForm();
  }, [selectedFlakeId]);

  return (
    <OpenGraphContext.Provider
      value={{
        setTime,
        captureTime,
        setShowPreview,
        showPreview,
        previewData,
        paUrl,
        setPaUrl,
        setLoadingDots,
        loadingDots,
      }}
    >
      {children}
    </OpenGraphContext.Provider>
  );
};

export const useOpenGraphContext = () => useContext(OpenGraphContext);
