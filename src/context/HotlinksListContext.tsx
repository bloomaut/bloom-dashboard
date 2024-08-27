import { get } from "@/services/fetch";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface IHotlinkListContext {
  hotlinkList: [];
  loading: boolean;
}

const HotlinkListContext = createContext<IHotlinkListContext>({
  hotlinkList: [],
  loading: true,
});

export const HotlinkListProvider = ({ children }: { children: JSX.Element }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [hotlinkList, setHotlinkList] = useState<[]>([]);

  useEffect(() => {
    const getHotlinks = async () => {
      const response = await get(`hotlink-collections/${id}`);
      if (response.statusCode === 200) {
        setHotlinkList(response.result.hotlinks);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    getHotlinks();
  }, []);

  return <HotlinkListContext.Provider value={{ loading, hotlinkList }}>{children}</HotlinkListContext.Provider>;
};

export const useHotlinkListContext = () => useContext(HotlinkListContext);
