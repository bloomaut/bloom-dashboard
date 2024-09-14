import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { DesignSelected, DesignsProps } from "@/typescript/interfaces/designs.interface";

interface Context {
  listTemplates: DesignsProps | undefined;
  loading: boolean;
  selectedList: number;
  setSelectedList: (id: number) => void;
  designSelected: DesignSelected | undefined;
  setDesignSelected: (design: DesignSelected) => void;
}

const DesignContext = createContext<Context>({
  listTemplates: undefined,
  loading: true,
  selectedList: 1,
  setSelectedList: () => undefined,
  designSelected: undefined,
  setDesignSelected: () => undefined,
});

export const DesignProvider = ({ children }: { children: JSX.Element }) => {
  const [listTemplates, setListTemplates] = useState<DesignsProps>();
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<number>(1);
  const [designSelected, setDesignSelected] = useState<DesignSelected>();

  useEffect(() => {
    const fetchPowerApps = async () => {
      setLoading(true);

      let type = "";
      let data: HogRelated[] = [];

      // SI EL INDEX SELECCIONADO ES 0, SE HACE EL GET DE TODOS LOS DISEÑOS
      if (selectedList === 0) {
        const response = await get("design-small/list");
        if (response.statusCode === 200) {
          type = "";
          data = response.result.designs;
        }
        // SI EL INDEX SELECCIONADO ES 1, SE HACE EL GET DE HOGS
      } else if (selectedList === 1) {
        const response = await get("design-small/hogs");
        if (response.statusCode === 200) {
          type = "Hog";
          data = response.result.hogs;
        }
        // SI EL INDEX SELECCIONADO ES 2, SE HACE EL GET DE EMAILS
      } else if (selectedList === 2) {
        const response = await get("design-small/emails");
        if (response.statusCode === 200) {
          type = "Email";
          data = response.result.emails;
        }
        // SI EL INDEX SELECCIONADO ES 3, SE HACE EL GET DE POSTS
      } else if (selectedList === 3) {
        const response = await get("design-small/posts");
        if (response.statusCode === 200) {
          type = "Post";
          data = response.result.posts;
        }
      }

      setListTemplates({ type, data });
      setLoading(false);
    };

    fetchPowerApps();
  }, [selectedList]);

  return (
    <DesignContext.Provider
      value={{ listTemplates, loading, selectedList, setSelectedList, designSelected, setDesignSelected }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesignContext = () => useContext(DesignContext);
