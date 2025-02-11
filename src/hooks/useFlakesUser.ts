import { get } from "@/services/fetch";
import { useAppSelector } from "@/store/hooks";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import { useEffect, useState } from "react";

export const useFlakeData = () => {
  const [flakes, setFlakes] = useState<Powerapp[]>([]);
  const [loading, setLoading] = useState(true);
  const { clientId } = useAppSelector(state => state.ricardosData);

  const fetchData = async () => {
    const response = await get("small/flakes/user");
    if (response.statusCode === 200) {
      setFlakes(response.result.powerapps);
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => { // Esperamos un poco para que primero responda el /me
      fetchData();
    }, 1000);
  }, [clientId]);

  return { flakes, loading };
};
