import axios from "axios";
import { useMessageToast } from "@/hooks/useMessageToast";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";
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
  setSelectedFlakeId: () => "",
});

export const FlakesProvider = ({ children }: { children: JSX.Element }) => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlakeId, setSelectedFlakeId] = useState("");

  const { notifyError } = useMessageToast();
  const dict = useTranslations("dict");

  useEffect(() => {
    //Fetch sin necesidad de estar logueado
    const fetchData = async () => {
      const response = await axios.get("/api/small");
      const allFlakes = response.data.data;
      console.log(allFlakes);
      if (allFlakes.statusCode === 200) {
        setFlakes(allFlakes.result.powerapps);
        setSelectedFlakeId(allFlakes.result.powerapps[0]._id);
        setLoading(false);
      } else {
        notifyError(dict("toast.error_tryagain"));
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
      }}
    >
      {children}
    </FlakesContext.Provider>
  );
};

export const useFlakesContext = () => useContext(FlakesContext);
