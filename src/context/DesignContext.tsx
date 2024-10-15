import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { DesignProps, DesignSelected, FlakesAndDesignProps } from "@/typescript/interfaces/designs.interface";
import { HogRelated } from "@/typescript/interfaces/flakes.interface";

interface Context {
  listTemplates: FlakesAndDesignProps | undefined;
  loading: boolean;
  selectedList: string;
  setSelectedList: (type: string) => void;
  designSelected: DesignSelected | undefined;
  setDesignSelected: (design: DesignSelected) => void;
  handleRemoveDesign: (deletedId: string) => void;
}

const DesignContext = createContext<Context>({
  listTemplates: undefined,
  loading: true,
  selectedList: "hog",
  setSelectedList: () => undefined,
  designSelected: undefined,
  setDesignSelected: () => undefined,
  handleRemoveDesign: () => {
    throw new Error("handleRemoveDesign function not implemented");
  },
});

export const DesignProvider = ({ children }: { children: JSX.Element }) => {
  const [listTemplates, setListTemplates] = useState<FlakesAndDesignProps>({
    type: "",
    flakes: [],
    designs: [],
    difussionHogs: [],
    genericPosts: [],
  });
  const [loading, setLoading] = useState(true);

  // Recuperamos el `selectedList` desde el localStorage (si existe)
  const savedSelectedList = typeof window !== "undefined" ? localStorage.getItem("selectedList") : "hog";
  const [selectedList, setSelectedList] = useState<string>(savedSelectedList || "hog");

  const [designSelected, setDesignSelected] = useState<DesignSelected>();

  useEffect(() => {
    const fetchPowerApps = async () => {
      setLoading(true);

      let type = "";
      let flakes: HogRelated[] = [];
      let designs: DesignProps[] = [];

      let difussionHogs = [];
      let postsWithoutVariables = [];

      if (selectedList === "landing") {
        console.log("GET LANDINGS");
        type = "Landing";
      } else if (selectedList === "hog") {
        const response = await get("design-small/hogs");
        if (response.statusCode === 200) {
          type = "Hog";
          flakes = response.result.hogs;
          designs = response.result.designs;
          difussionHogs = response.result?.difussionHogs;
        }
      } else if (selectedList === "post") {
        const response = await get("design-small/posts");
        if (response.statusCode === 200) {
          type = "Post";
          flakes = response.result.posts;
          designs = response.result.designs;
          postsWithoutVariables = response.result?.postsWithoutVariables;
        }
      }

      setListTemplates({ type, flakes, designs, difussionHogs, genericPosts: postsWithoutVariables });
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
      const filteredDesigns = listTemplates?.flakes.filter(item => item._id !== deletedId);
      setListTemplates({ ...listTemplates, flakes: filteredDesigns });
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
