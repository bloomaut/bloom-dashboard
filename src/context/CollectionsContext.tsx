import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  id: string;
  setId: (i: string) => void;
  collectionsList: CollectionList[];
  setCollectionsList: React.Dispatch<React.SetStateAction<CollectionList[]>>;
}

const CollectionsContext = createContext<Context>({
  id: "",
  setId: () => "",
  collectionsList: [],
  setCollectionsList: () => [],
});

export const CollectionsProvider = ({ children }: { children: JSX.Element }) => {
  const [id, setId] = useState<string>("");
  const [collectionsList, setCollectionsList] = useState<CollectionList[]>([]);
  console.log(collectionsList);

  useEffect(() => {
    const getCollections = async () => {
      const response = await get("hotlink-collections/client/list", ENV.DASH);
      console.log(response);
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
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollectionsContext = () => useContext(CollectionsContext);
