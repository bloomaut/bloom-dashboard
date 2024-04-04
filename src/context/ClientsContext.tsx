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
  searchValue: string;
  setSearchValue: (i: string) => void;
  filteredClients: ClientsProps[];
}

const ClientsContext = createContext<ClientsContextType>({
  clients: [],
  loading: true,
  fetchClients: () => Promise<void>,
  clientSelected: null,
  setClientSelected: () => null,
  searchValue: "",
  setSearchValue: () => "",
  filteredClients: [],
});

export const ClientsProvider = ({ children }: { children: JSX.Element }) => {
  const [clients, setClients] = useState<ClientsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [clientSelected, setClientSelected] = useState<ClientsProps | null>(null);
  const dispatch = useAppDispatch();
  /* Para buscador */
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredClients, setFilteredClients] = useState<ClientsProps[]>(clients);

  const fetchClients = async () => {
    const data = await get("client-customer", ENV.DASH);
    console.log(data);
    if (data.statusCode === 200) {
      dispatch(setClientsData(data.result.data));
      setClients(data.result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const filteredData = clients.filter(
      client =>
        client.clientCode?.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.ClientFirstname.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.ClientEmail.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilteredClients(filteredData);
  }, [searchValue, clients, setClients]);

  useEffect(() => {
    fetchClients();
  }, [dispatch]);

  useEffect(() => {
    if (!clientSelected && filteredClients.length > 0) {
      setClientSelected(filteredClients[0]);
    }
  }, [clientSelected, filteredClients]);

  return (
    <ClientsContext.Provider
      value={{
        clients,
        loading,
        fetchClients,
        clientSelected,
        setClientSelected,
        searchValue,
        setSearchValue,
        filteredClients,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClientsContext = () => useContext(ClientsContext);
