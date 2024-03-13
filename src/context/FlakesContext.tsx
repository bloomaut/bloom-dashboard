import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  flakes: Powerapp[];
  loading: boolean;
  selectedFlakeId: string;
}

const FlakesContext = createContext<Context>({ flakes: [], loading: true, selectedFlakeId: "" });

export const FlakesProvider = ({ children }: { children: JSX.Element }) => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const allFlakes = await get("small/flakes/playground", ENV.IUTOOL);
      if (allFlakes.statusCode === 200) {
        setFlakes(allFlakes.result.powerapps);
        setLoading(false);
      } else {
        console.error("Error fetching Flakes:", allFlakes);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <FlakesContext.Provider value={{ flakes, loading, selectedFlakeId: flakes.length > 0 ? flakes[0]._id : "" }}>
      {children}
    </FlakesContext.Provider>
  );
};

export const useFlakesContext = () => useContext(FlakesContext);
