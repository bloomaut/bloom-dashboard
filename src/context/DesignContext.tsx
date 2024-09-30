import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { DesignProps, DesignSelected, DiffusionProps } from "@/typescript/interfaces/designs.interface";
import { HogRelated } from "@/typescript/interfaces/flakes.interface";

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
  const [listTemplates, setListTemplates] = useState<DiffusionProps>({
    type: "",
    hogs: [],
    designs: [],
  });
  const [loading, setLoading] = useState(true);

  // Recuperamos el `selectedList` desde el localStorage (si existe)
  const savedSelectedList = typeof window !== "undefined" ? localStorage.getItem("selectedList") : "1";
  const [selectedList, setSelectedList] = useState<number>(parseInt(savedSelectedList || "1"));

  const [designSelected, setDesignSelected] = useState<DesignSelected>();

  useEffect(() => {
    const fetchPowerApps = async () => {
      setLoading(true);

      let type = "";
      let hogs: HogRelated[] = [];
      let designs: DesignProps[] = [];

      if (selectedList === 0) {
        const response = await get("design-small/list");
        if (response.statusCode === 200) {
          hogs = response.result.designs;
        }
      } else if (selectedList === 1) {
        const response = await get("design-small/hogs");
        if (response.statusCode === 200) {
          type = "Hog";
          hogs = response.result.hogs;
          designs = response.result.designs;
        }
      } else if (selectedList === 2) {
        const response = await get("design-small/emails");
        if (response.statusCode === 200) {
          type = "Email";
          hogs = response.result.emails;
          designs = response.result.designs;
        }
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

  useEffect(() => {
    localStorage.setItem("selectedList", selectedList.toString());
  }, [selectedList]);

  const handleRemoveDesign = (deletedId: string) => {
    if (listTemplates?.designs.length) {
      const filteredDesigns = listTemplates.designs.filter(item => item._id !== deletedId);
      setListTemplates({ ...listTemplates, designs: filteredDesigns });
    } else {
      const filteredDesigns = listTemplates?.hogs.filter(item => item._id !== deletedId);
      setListTemplates({ ...listTemplates, hogs: filteredDesigns });
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
