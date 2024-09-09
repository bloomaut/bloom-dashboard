import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";

interface Context {
  listTemplates: HogRelated[];
  loading: boolean;
  selectedList: number;
  setSelectedList: (id: number) => void;
  setTemplateIdSelected: (id: string) => void;
  templateIdSelected: string;
}

const DesignContext = createContext<Context>({
  listTemplates: [],
  loading: true,
  selectedList: 1,
  setSelectedList: () => undefined,
  setTemplateIdSelected: () => undefined,
  templateIdSelected: "",
});

export const DesignProvider = ({ children }: { children: JSX.Element }) => {
  const [listTemplates, setListTemplates] = useState<HogRelated[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<number>(1);
  const [templateIdSelected, setTemplateIdSelected] = useState<string>("");

  useEffect(() => {
    const fetchPowerApps = async () => {
      if (selectedList === 1) {
        setLoading(true);
        const response = await get("designs/hogs");
        if (response.statusCode === 200) {
          setListTemplates(response.result.hogs);
        }
        setLoading(false);
      }
    };

    fetchPowerApps();
  }, [selectedList]);

  return (
    <DesignContext.Provider
      value={{ listTemplates, loading, selectedList, setSelectedList, setTemplateIdSelected, templateIdSelected }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesignContext = () => useContext(DesignContext);
