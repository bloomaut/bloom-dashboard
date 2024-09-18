import { HogRelated } from "@/typescript/interfaces/flakes.interface";
import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { DesignSelected, DiffusionProps } from "@/typescript/interfaces/designs.interface";

interface Context {
  listTemplates: DiffusionProps | undefined;
  loading: boolean;
  selectedList: number;
  setSelectedList: (id: number) => void;
  designSelected: DesignSelected | undefined;
  setDesignSelected: (design: DesignSelected) => void;
  handleRemoveDesign: (deletedId: string) => void;
}

const DesignContext = createContext<Context>({
  listTemplates: undefined,
  loading: true,
  selectedList: 1,
  setSelectedList: () => undefined,
  designSelected: undefined,
  setDesignSelected: () => undefined,
  handleRemoveDesign: () => {
    throw new Error("handleRemoveDesign function not implemented");
  },
});

export const DesignProvider = ({ children }: { children: JSX.Element }) => {
  const [listTemplates, setListTemplates] = useState<DiffusionProps>();
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<number>(1);
  const [designSelected, setDesignSelected] = useState<DesignSelected>();

  useEffect(() => {
    const fetchPowerApps = async () => {
      setLoading(true);

      let type = "";
      let hogs: HogRelated[] = [];
      let designs: any[] = [];

      // SI EL INDEX SELECCIONADO ES 0, SE HACE EL GET DE TODOS LOS DISEÑOS
      if (selectedList === 0) {
        const response = await get("design-small/list");
        if (response.statusCode === 200) {
          type = "";
          hogs = response.result.designs;
        }
        // SI EL INDEX SELECCIONADO ES 1, SE HACE EL GET DE HOGS
      } else if (selectedList === 1) {
        const response = await get("design-small/hogs");
        if (response.statusCode === 200) {
          type = "Hog";
          hogs = response.result.hogs;
          designs = response.result.designs;
        }
        // SI EL INDEX SELECCIONADO ES 2, SE HACE EL GET DE EMAILS
      } else if (selectedList === 2) {
        const response = await get("design-small/emails");
        if (response.statusCode === 200) {
          type = "Email";
          hogs = response.result.emails;
          designs = response.result.designs;
        }
        // SI EL INDEX SELECCIONADO ES 3, SE HACE EL GET DE POSTS
      } else if (selectedList === 3) {
        const response = await get("design-small/posts");
        if (response.statusCode === 200) {
          type = "Post";
          hogs = response.result.posts;
          designs = response.result.designs;
        }
      }

      setListTemplates({ type, hogs, designs });
      setLoading(false);
    };

    fetchPowerApps();
  }, [selectedList]);

  const handleRemoveDesign = (deletedId: string) => {
    if (listTemplates) {
      const filteredDesigns = listTemplates.designs.filter(item => item._id !== deletedId);
      setListTemplates({ ...listTemplates, designs: filteredDesigns });
    }
  };

  return (
    <DesignContext.Provider
      value={{
        listTemplates,
        loading,
        selectedList,
        setSelectedList,
        designSelected,
        setDesignSelected,
        handleRemoveDesign,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesignContext = () => useContext(DesignContext);
