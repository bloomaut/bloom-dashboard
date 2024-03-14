import { get } from "@/services/fetch";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { ENV } from "@/typescript/types/environment.enum";
import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  flakes: Powerapp[];
  loading: boolean;
  selectedFlakeId: string;
  setSelectedFlakeId: (id: string) => void;
}

const FlakesContext = createContext<Context>({
  flakes: [],
  loading: true,
  selectedFlakeId: "",
  // eslint-disable-next-line no-empty-function
  setSelectedFlakeId: () => {},
});

export const FlakesProvider = ({ children }: { children: JSX.Element }) => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlakeId, setSelectedFlakeId] = useState("");

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
    <FlakesContext.Provider value={{ flakes, loading, selectedFlakeId, setSelectedFlakeId }}>
      {children}
    </FlakesContext.Provider>
  );
};

export const useFlakesContext = () => useContext(FlakesContext);
