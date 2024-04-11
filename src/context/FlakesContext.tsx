import axios from "axios";
import { useMessageToast } from "@/hooks/useMessageToast";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { HotlinkList } from "@/typescript/interfaces/hotlink.interface";
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
  id: string;
  setId: (i: string) => void;
  hotlinksList: HotlinkList[];
  setHotlinksList: React.Dispatch<React.SetStateAction<HotlinkList[]>>;
  filteredHotlinks: HotlinkList | null;
  setFilteredHotlinks: React.Dispatch<React.SetStateAction<HotlinkList | null>>;
}

const FlakesContext = createContext<Context>({
  flakes: [],
  loading: true,
  selectedFlakeId: "",
  setSelectedFlakeId: () => "",
  id: "",
  setId: () => "",
  hotlinksList: [],
  setHotlinksList: () => [],
  filteredHotlinks: null,
  setFilteredHotlinks: () => null,
});

export const FlakesProvider = ({ children }: { children: JSX.Element }) => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlakeId, setSelectedFlakeId] = useState("");
  const { notifyError } = useMessageToast();
  const dict = useTranslations("dict.toast");
  const path = usePathname();

  const [id, setId] = useState<string>("");
  const [hotlinksList, setHotlinksList] = useState<HotlinkList[]>([]);
  const [filteredHotlinks, setFilteredHotlinks] = useState<HotlinkList | null>(null);

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
    if (response.statusCode === 200) {
      setFlakes(response.result.powerapps);
      setSelectedFlakeId(response.result.powerapps[0]._id);
      setLoading(false);
    } else {
      notifyError(dict("error_tryagain"));
      setLoading(false);
    }
  };

  //Función para acceder a la lista de hotlinks sin colección
  useEffect(() => {
    const getList = async () => {
      const response = await get("hotlinks/no-collection", ENV.DASH);
      if (response.statusCode === 200) {
        setHotlinksList(response.result.hotlinks.hotlinks);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    getList();
  }, []);

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
        id,
        setId,
        hotlinksList,
        setHotlinksList,
        filteredHotlinks,
        setFilteredHotlinks,
      }}
    >
      {children}
    </FlakesContext.Provider>
  );
};

export const useFlakesContext = () => useContext(FlakesContext);
