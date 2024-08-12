import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useAppDispatch } from "@/store/hooks";

interface ClientsContextType {
  clients: ClientsProps[];
  loading: boolean;
  clientSelected: ClientsProps | null;
  setClientSelected: Dispatch<SetStateAction<ClientsProps | null>>;
  searchValue: string;
  setSearchValue: (i: string) => void;
  filteredClients: ClientsProps[];
  updateClients: (newClient: ClientsProps) => void;
  setClients: Dispatch<SetStateAction<ClientsProps[]>>;
}

const ClientsContext = createContext<ClientsContextType>({
  clients: [],
  loading: true,
  clientSelected: null,
  setClientSelected: () => null,
  searchValue: "",
  setSearchValue: () => "",
  filteredClients: [],
  updateClients: () => null,
  setClients: () => null,
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
    const data = await get("client-customer");
    if (data.statusCode === 200) {
      setClients(data.result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, [dispatch]);

  const updateClients = (newClient: ClientsProps) => {
    setClients(prevClients => {
      const index = prevClients.findIndex(client => client._id === newClient._id);
      if (index > -1) {
        // Cliente existe, reemplazar el cliente existente
        return prevClients.map((client, i) => (i === index ? newClient : client));
      } else {
        // Cliente no existe, agregar el nuevo cliente al array
        return [...prevClients, newClient];
      }
    });
  };

  useEffect(() => {
    if (clients) {
      const filteredData = clients.filter(
        client =>
          client.ClientCode?.toLowerCase().includes(searchValue.toLowerCase()) ||
          client.ClientFirstname?.toLowerCase().includes(searchValue.toLowerCase()) ||
          client.ClientEmail?.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredClients(filteredData);
    }
  }, [searchValue, clients, setClients]);

  return (
    <ClientsContext.Provider
      value={{
        clients,
        loading,
        clientSelected,
        setClientSelected,
        searchValue,
        setSearchValue,
        filteredClients,
        updateClients,
        setClients,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClientsContext = () => useContext(ClientsContext);
