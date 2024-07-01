import { useMessageToast } from "@/hooks/useMessageToast";
import { get } from "@/services/fetch";
import { CollectionList } from "@/typescript/interfaces/hotlinkCollections.interface";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  id: string;
  setId: (i: string) => void;
  collectionsList: CollectionList[];
  setCollectionsList: React.Dispatch<React.SetStateAction<CollectionList[]>>;
  addCollection: (collection: CollectionList) => void;
  filteredCollections: CollectionList[] | null;
  setFilteredCollections: React.Dispatch<React.SetStateAction<CollectionList[] | null>>;
  loading: boolean;
}

const CollectionsContext = createContext<Context>({
  id: "",
  setId: () => "",
  collectionsList: [],
  setCollectionsList: () => [],
  // eslint-disable-next-line no-empty-function
  addCollection: () => {},
  filteredCollections: null,
  setFilteredCollections: () => null,
  loading: true,
});

export const CollectionsProvider = ({ children }: { children: JSX.Element }) => {
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [collectionsList, setCollectionsList] = useState<CollectionList[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<CollectionList[] | null>(null);
  const { notifyError } = useMessageToast();
  const dict = useTranslations("dict.toast");

  useEffect(() => {
    const getCollections = async () => {
      const response = await get("hotlink-collections/client/list");
      if (response.statusCode === 200) {
        setCollectionsList(response.result);
        setLoading(false);
      } else {
        notifyError(dict("error_tryagain"));
        setLoading(false);
      }
    };

    getCollections();
  }, []);

  const addCollection = (collection: CollectionList) => {
    setCollectionsList(prevList => [...prevList, collection]);
  };

  return (
    <CollectionsContext.Provider
      value={{
        id,
        setId,
        collectionsList,
        setCollectionsList,
        addCollection,
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
