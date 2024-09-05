import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";

interface Context {
  powerapps: HogRelated[];
  loading: boolean;
  selectedList: number;
  setSelectedList: (id: number) => void;
}

const DesignContext = createContext<Context>({
  powerapps: [],
  loading: true,
  selectedList: 1,
  setSelectedList: () => undefined,
});

export const DesignProvider = ({ children }: { children: JSX.Element }) => {
  const [powerapps, setPowerapps] = useState<HogRelated[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<number>(1);

  useEffect(() => {
    const fetchPowerApps = async () => {
      if (selectedList === 1) {
        setLoading(true);
        const response = await get("designs/powerapps");
        if (response.statusCode === 200) {
          setPowerapps(response.result.powerApps);
        }
        setLoading(false);
      }
    };

    fetchPowerApps();
  }, [selectedList]);

  return (
    <DesignContext.Provider value={{ powerapps, loading, selectedList, setSelectedList }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesignContext = () => useContext(DesignContext);
