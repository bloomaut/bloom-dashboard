import { createContext, useContext, useState } from "react";
interface Context {
  id: string;
  setId: (i: string) => void;
}

const CollectionsContext = createContext<Context>({
  id: "",
  setId: () => "",
});

export const CollectionsProvider = ({ children }: { children: JSX.Element }) => {
  const [id, setId] = useState<string>("");

  return (
    <CollectionsContext.Provider
      value={{
        id,
        setId,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollectionsContext = () => useContext(CollectionsContext);
