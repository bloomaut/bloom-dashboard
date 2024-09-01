import axios from "axios";
import { useMessageToast } from "@/hooks/useMessageToast";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { get } from "@/services/fetch";
import { HotlinkList } from "@/typescript/interfaces/hotlink.interface";

interface Context {
  flakes: Powerapp[];
  loading: boolean;
  selectedFlakeId: string;
  setSelectedFlakeId: (id: string) => void;
  difussionLink: string | null;
  id: string;
  setId: (i: string) => void;
  getDiffusionLink: (flakeId: string) => Promise<string | null>;
  getHotlinkList: (offset: number, limit: number) => void;
  totalHotlinks: number;
  hotlinkList: HotlinkList[] | [];
}

const FlakesContext = createContext<Context>({
  flakes: [],
  loading: true,
  selectedFlakeId: "",
  setSelectedFlakeId: () => "",
  difussionLink: null,
  id: "",
  setId: () => "",
  getDiffusionLink: () => Promise.resolve(null),
  getHotlinkList: async () => [],
  totalHotlinks: 0,
  hotlinkList: [],
});

export const FlakesProvider = ({ children }: { children: JSX.Element }) => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlakeId, setSelectedFlakeId] = useState("");
  const [difussionLink, setDifussionLink] = useState<string | null>("");
  const { notifyError } = useMessageToast();
  const dict = useTranslations("dict.toast");
  const path = usePathname();

  const [id, setId] = useState<string>("");
  const [hotlinkList, setHotlinkList] = useState<HotlinkList[]>([]);
  const [totalHotlinks, setTotalHotlinks] = useState(0);

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

  const getHotlinkList = async (offset: number, limit: number) => {
    const response = await get(`hotlinks/list?limit=${limit}&offset=${offset}`);
    if (response.statusCode === 200) {
      setTotalHotlinks(response.result.hotlinks.total);
      setHotlinkList(response.result.hotlinks.hotlinks);
    } else {
      notifyError(dict("error_tryagain"));
    }
    setLoading(false);
  };

  const fetchDataHotlink = async () => {
    const response = await get("small/flakes/user");
    if (response.statusCode === 200) {
      setFlakes(response.result.powerapps);
      if (response.result.powerapps.length) {
        const firstFlakeId = response.result.powerapps[0]._id;
        setSelectedFlakeId(firstFlakeId);
      } else {
        setSelectedFlakeId("");
      }
      setLoading(false);
    }
  };

  const getDiffusionLink = async (flakeId: string): Promise<string | null> => {
    const response = await get(`hotlinks/diffusion/powerapp/${flakeId}`);
    if (response.statusCode === 200) {
      return response.result.diffusionUrl;
    } else {
      return null;
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
        difussionLink,
        id,
        setId,
        getDiffusionLink,
        getHotlinkList,
        totalHotlinks,
        hotlinkList,
      }}
    >
      {children}
    </FlakesContext.Provider>
  );
};

export const useFlakesContext = () => useContext(FlakesContext);
