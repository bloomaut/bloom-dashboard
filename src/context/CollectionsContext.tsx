import { get } from "@/services/fetch";
import { CollectionList } from "@/typescript/interfaces/hotlinkCollections.interface";
import { ENV } from "@/typescript/types/environment.enum";
import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  id: string;
  setId: (i: string) => void;
  collectionsList: CollectionList[];
  setCollectionsList: React.Dispatch<React.SetStateAction<CollectionList[]>>;
  filteredCollections: CollectionList | null;
  setFilteredCollections: React.Dispatch<React.SetStateAction<CollectionList | null>>;
}

const CollectionsContext = createContext<Context>({
  id: "",
  setId: () => "",
  collectionsList: [],
  setCollectionsList: () => [],
  filteredCollections: null,
  setFilteredCollections: () => null,
});

export const CollectionsProvider = ({ children }: { children: JSX.Element }) => {
  const [id, setId] = useState<string>("");
  const [collectionsList, setCollectionsList] = useState<CollectionList[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<CollectionList | null>(null);

  useEffect(() => {
    const getCollections = async () => {
      const response = await get("hotlink-collections/client/list", ENV.DASH);

      if (response.statusCode === 200) {
        setCollectionsList(response.result.hotlinkCollections);
      }
    };

    getCollections();
  }, []);

  return (
    <CollectionsContext.Provider
      value={{
        id,
        setId,
        collectionsList,
        setCollectionsList,
        filteredCollections,
        setFilteredCollections,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollectionsContext = () => useContext(CollectionsContext);
