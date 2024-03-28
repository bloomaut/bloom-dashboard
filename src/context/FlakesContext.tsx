import axios from "axios";
import { useMessageToast } from "@/hooks/useMessageToast";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ENV } from "@/typescript/types/environment.enum";
import { get } from "@/services/fetch";

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
  const dict = useTranslations("dict.toast");
  const path = usePathname();

  //Fetch sin necesidad de estar logueado
  const fetchData = async () => {
    const response = await axios.get("/api/small");
    const allFlakes = response.data.data;

    if (allFlakes.statusCode === 200) {
      setFlakes(allFlakes.result.powerapps);
      setSelectedFlakeId(allFlakes.result.powerapps[0]._id);
      setLoading(false);
    } else {
      notifyError(dict("error_tryagain"));
      setLoading(false);
    }
  };

  const fetchDataHotlink = async () => {
    const response = await get("small/flakes/user", ENV.UITOOL);
    console.log(response);
    if (response.statusCode === 200) {
      setFlakes(response.result.powerapps);
      setSelectedFlakeId(response.result.powerapps[0]._id);
      setLoading(false);
    } else {
      notifyError(dict("error_tryagain"));
      setLoading(false);
    }
  };

  useEffect(() => {
    // Para no tener que volver a copiar un Context igual
    // en la página de hotlink, vamos a reusar este.
    // Si venis de hotlink haces el fecth con logueado
    // si venis de Playground sin usuario logueado
    if (path.includes("hotlink")) {
      fetchDataHotlink();
    } else {
      fetchData();
    }
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
