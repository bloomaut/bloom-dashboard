import { get } from "@/services/fetch";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useEffect, useState } from "react";
import { useMessageToast } from "./useMessageToast";
import { useTranslations } from "next-intl";

export const useFlakeData = () => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifyError } = useMessageToast();
  const dict = useTranslations("dict.toast");

  useEffect(() => {
    const fetchData = async () => {
      const response = await get("small/flakes/user");
      if (response.statusCode === 200) {
        setFlakes(response.result.powerapps);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { flakes, loading };
};
