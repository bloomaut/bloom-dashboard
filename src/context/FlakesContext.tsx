import { get } from "@/services/fetch";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { HotlinkData } from "@/typescript/interfaces/hotlink.interface";
import { ENV } from "@/typescript/types/environment.enum";
import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  flakes: Powerapp[];
  loading: boolean;
  selectedFlakeId: string;
  hotlinkData: HotlinkData;
  setSelectedFlakeId: (id: string) => void;
  setHotlinkData: React.Dispatch<React.SetStateAction<HotlinkData>>;
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
  hotlinkData: EmptyHotlinkData,
  // eslint-disable-next-line no-empty-function
  setSelectedFlakeId: () => {},
  // eslint-disable-next-line no-empty-function
  setHotlinkData: () => {},
});

export const FlakesProvider = ({ children }: { children: JSX.Element }) => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlakeId, setSelectedFlakeId] = useState("");
  const [hotlinkData, setHotlinkData] = useState(EmptyHotlinkData);

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
      value={{ flakes, loading, selectedFlakeId, setSelectedFlakeId, hotlinkData, setHotlinkData }}
    >
      {children}
    </FlakesContext.Provider>
  );
};

export const useFlakesContext = () => useContext(FlakesContext);
