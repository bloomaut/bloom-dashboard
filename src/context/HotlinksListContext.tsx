import { get } from "@/services/fetch";
import { HotlinkCollection } from "@/typescript/interfaces/hotlinkList.interface";
import { ENV } from "@/typescript/types/environment.enum";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface IHotlinkListContext {
  hotlinkCollection: HotlinkCollection | null;
  hotlinkList: [];
  loading: boolean;
}

const HotlinkListContext = createContext<IHotlinkListContext>({
  hotlinkCollection: null,
  hotlinkList: [],
  loading: true,
});

export const HotlinkListProvider = ({ children }: { children: JSX.Element }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [hotlinkCollection, setHotlinkCollection] = useState<HotlinkCollection | null>(null);
  const [hotlinkList, setHotlinkList] = useState<[]>([]);

  useEffect(() => {
    const getCollections = async () => {
      const response = await get(`hotlink-collections/${id}`, ENV.DASH);
      if (response.statusCode === 200) {
        setHotlinkCollection(response.result.hotlinkCollection);
        setHotlinkList(response.result.hotlinks.list);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    getCollections();
  }, []);

  return (
    <HotlinkListContext.Provider value={{ loading, hotlinkCollection, hotlinkList }}>
      {children}
    </HotlinkListContext.Provider>
  );
};

export const useHotlinkListContext = () => useContext(HotlinkListContext);
