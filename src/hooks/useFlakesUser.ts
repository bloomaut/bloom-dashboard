import { get } from "@/services/fetch";
import { useAppSelector } from "@/store/hooks";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useEffect, useState } from "react";

export const useFlakeData = () => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const { clientId } = useAppSelector(state => state.ricardosData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get("small/flakes/user");
      if (response.statusCode === 200) {
        setFlakes(response.result.powerapps);
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  return { flakes, loading };
};
