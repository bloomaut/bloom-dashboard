import { get } from "@/services/fetch";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { HotlinkData } from "@/typescript/interfaces/hotlink.interface";
import { ENV } from "@/typescript/types/environment.enum";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  flakes: Powerapp[];
  loading: boolean;
  selectedFlakeId: string;
  setSelectedFlakeId: (id: string) => void;
  setHotlinkData: React.Dispatch<React.SetStateAction<HotlinkData>>;
  setTime: () => void;
  captureTime: string;
  setShowPreview: (i: boolean) => void;
  showPreview: boolean;
  previewData: any;
  paUrl: string;
  fetchOpenGraphData: () => void;
}

const EmptyHotlinkData: HotlinkData = {
  hotlink: {
    id: null,
    power_app_hash: "",
  },
};

const FlakesContext = createContext<Context>({
  flakes: [],
  loading: true,
  selectedFlakeId: "",
  // eslint-disable-next-line no-empty-function
  setSelectedFlakeId: () => {},
  // eslint-disable-next-line no-empty-function
  setHotlinkData: () => {},
  // eslint-disable-next-line no-empty-function
  setTime: () => {},
  captureTime: "",
  setShowPreview: () => true,
  showPreview: true,
  previewData: null,
  paUrl: "",
  // eslint-disable-next-line no-empty-function
  fetchOpenGraphData: () => {},
});

export const FlakesProvider = ({ children }: { children: JSX.Element }) => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlakeId, setSelectedFlakeId] = useState("");
  const [hotlinkData, setHotlinkData] = useState(EmptyHotlinkData);
  const [captureTime, setCaptureTime] = useState<string>("");
  const [showPreview, setShowPreview] = useState(true);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const paUrl = `https://power-app-engine.vercel.app/${hotlinkData.hotlink.power_app_hash}`;

  const setTime = () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCaptureTime(currentTime);
  };

  const fetchOpenGraphData = async () => {
    const newUrl = encodeURIComponent(paUrl);
    try {
      const response = await axios.get(
        `https://opengraph.io/api/1.1/site/${newUrl}?app_id=e920319f-bb40-4d46-b146-d3e79df591bc`,
      );
      setPreviewData(response.data);
    } catch (error) {
      console.error("Error fetching Open Graph data:", error);
    }
  };

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
        setHotlinkData,
        setTime,
        captureTime,
        setShowPreview,
        showPreview,
        previewData,
        paUrl,
        fetchOpenGraphData,
      }}
    >
      {children}
    </FlakesContext.Provider>
  );
};

export const useFlakesContext = () => useContext(FlakesContext);
