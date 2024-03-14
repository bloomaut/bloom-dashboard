import { get } from "@/services/fetch";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { ENV } from "@/typescript/types/environment.enum";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  flakes: Powerapp[];
  loading: boolean;
  selectedFlakeId: string;
  setSelectedFlakeId: (id: string) => void;
  setTime: () => void;
  captureTime: string;
  setShowPreview: (i: boolean) => void;
  showPreview: boolean;
  previewData: any;
  paUrl: string;
  setPaUrl: (url: string) => void;
}

const FlakesContext = createContext<Context>({
  flakes: [],
  loading: true,
  selectedFlakeId: "",
  // eslint-disable-next-line no-empty-function
  setSelectedFlakeId: () => {},
  // eslint-disable-next-line no-empty-function
  setTime: () => {},
  captureTime: "",
  setShowPreview: () => true,
  showPreview: true,
  previewData: null,
  paUrl: "",
  setPaUrl: () => "",
});

export const FlakesProvider = ({ children }: { children: JSX.Element }) => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlakeId, setSelectedFlakeId] = useState("");
  const [captureTime, setCaptureTime] = useState<string>("");
  const [showPreview, setShowPreview] = useState(true);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [paUrl, setPaUrl] = useState("");

  const setTime = () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCaptureTime(currentTime);
  };

  useEffect(() => {
    const fetchOpenGraphData = async () => {
      console.log(paUrl);
      const newUrl = encodeURIComponent(paUrl);
      try {
        const response = await axios.get(
          `https://opengraph.io/api/1.1/site/${newUrl}?app_id=5bc87279-0550-4e7b-bc9b-1f17fb2becb1`,
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

  useEffect(() => {
    const fetchData = async () => {
      const allFlakes = await get("small/flakes/playground", ENV.UITOOL);
      if (allFlakes.statusCode === 200) {
        setFlakes(allFlakes.result.powerapps);
        setSelectedFlakeId(allFlakes.result.powerapps[0]._id);
        setLoading(false);
      } else {
        console.error("Error fetching Flakes:", allFlakes);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <FlakesContext.Provider
      value={{
        flakes,
        loading,
        selectedFlakeId,
        setSelectedFlakeId,
        setTime,
        captureTime,
        setShowPreview,
        showPreview,
        previewData,
        paUrl,
        setPaUrl,
      }}
    >
      {children}
    </FlakesContext.Provider>
  );
};

export const useFlakesContext = () => useContext(FlakesContext);
