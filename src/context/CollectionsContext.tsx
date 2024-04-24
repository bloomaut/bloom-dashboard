import { get } from "@/services/fetch";
import { CollectionList } from "@/typescript/interfaces/hotlinkCollections.interface";
import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  id: string;
  setId: (i: string) => void;
  collectionsList: CollectionList[];
  setCollectionsList: React.Dispatch<React.SetStateAction<CollectionList[]>>;
  filteredCollections: CollectionList[] | null;
  setFilteredCollections: React.Dispatch<React.SetStateAction<CollectionList[] | null>>;
  loading: boolean;
}

const CollectionsContext = createContext<Context>({
  id: "",
  setId: () => "",
  collectionsList: [],
  setCollectionsList: () => [],
  filteredCollections: null,
  setFilteredCollections: () => null,
  loading: true,
});

export const CollectionsProvider = ({ children }: { children: JSX.Element }) => {
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [collectionsList, setCollectionsList] = useState<CollectionList[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<CollectionList[] | null>(null);

  useEffect(() => {
    const getCollections = async () => {
      const response = await get("hotlink-collections/client/list");

      if (response.statusCode === 200) {
        setCollectionsList(response.result.hotlinkCollections);
        setLoading(false);
      } else {
        setLoading(false);
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
        loading,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollectionsContext = () => useContext(CollectionsContext);
