import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { setClientsData } from "@/store/features/clients";
import { useAppDispatch } from "@/store/hooks";

interface ClientsContextType {
  clients: ClientsProps[];
  loading: boolean;
  fetchClients: () => void;
  clientSelected: ClientsProps | null;
  setClientSelected: Dispatch<SetStateAction<ClientsProps | null>>;
}

const ClientsContext = createContext<ClientsContextType>({
  clients: [],
  loading: true,
  fetchClients: () => Promise<void>,
  clientSelected: null,
  setClientSelected: () => null,
});

export const ClientsProvider = ({ children }: { children: JSX.Element }) => {
  const [clients, setClients] = useState<ClientsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [clientSelected, setClientSelected] = useState<ClientsProps | null>(null);
  const dispatch = useAppDispatch();

  const fetchClients = async () => {
    const data = await get("client-customer", ENV.DASH);
    if (data.statusCode === 200) {
      dispatch(setClientsData(data.result.data));
      setClients(data.result.data);
      setClientSelected(data.result.data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, [dispatch]);

  return (
    <ClientsContext.Provider value={{ clients, loading, fetchClients, clientSelected, setClientSelected }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClientsContext = () => useContext(ClientsContext);
