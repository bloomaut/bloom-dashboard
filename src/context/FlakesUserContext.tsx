import { useMessageToast } from "@/hooks/useMessageToast";
import { get } from "@/services/fetch";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { ENV } from "@/typescript/types/environment.enum";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  flakes: Powerapp[];
  loading: boolean;
}

const FlakesUserContext = createContext<Context>({
  flakes: [],
  loading: true,
});

export const FlakesUserProvider = ({ children }: { children: JSX.Element }) => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);

  const { notifyError } = useMessageToast();
  const dict = useTranslations("dict.toast");

  useEffect(() => {
    const fetchData = async () => {
      const response = await get("small/flakes/user", ENV.UITOOL);

      if (response.statusCode === 200) {
        setFlakes(response.result.powerapps);
        setLoading(false);
      } else {
        notifyError(dict("error_tryagain"));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return <FlakesUserContext.Provider value={{ flakes, loading }}>{children}</FlakesUserContext.Provider>;
};

export const useFlakesUserContext = () => useContext(FlakesUserContext);
