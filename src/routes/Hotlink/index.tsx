import { ClientsProvider } from "@/context/ClientsContext";
import { FlakesProvider } from "@/context/FlakesContext";
import Hotlinks from "./Hotlink";

const HotlinksPage = () => {
  return (
    <FlakesProvider>
      <ClientsProvider>
        <Hotlinks />
      </ClientsProvider>
    </FlakesProvider>
  );
};

export default HotlinksPage;
