import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
/* import { useAppDispatch } from "@/store/hooks"; */
import { useDebouncedCallback } from "use-debounce";

interface ClientsContextType {
  clients: ClientsProps[];
  loading: boolean;
  clientSelected: ClientsProps | null;
  setClientSelected: Dispatch<SetStateAction<ClientsProps | null>>;
  searchValue: string;
  setSearchValue: (i: string) => void;
  filteredClients: ClientsProps[];
  fetchClients: (offset: number, limit: number, search?: string) => void;
  totalClients: number;
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
  fetchClients: async () => [],
  totalClients: 0,
  updateClients: () => null,
  setClients: () => null,
});

export const ClientsProvider = ({ children }: { children: JSX.Element }) => {
  const [clients, setClients] = useState<ClientsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [clientSelected, setClientSelected] = useState<ClientsProps | null>(null);
  const [totalClients, setTotalClients] = useState(0);
  /*  const dispatch = useAppDispatch(); */
  /* Para buscador */
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredClients, setFilteredClients] = useState<ClientsProps[]>(clients);

  const fetchClients = async (offset: number, limit: number, search: string = "") => {
    const data = await get(`client-customer?limit=${limit}&offset=${offset}&search=${search}`);
    if (data.statusCode === 200) {
      setTotalClients(data.result.total);
      setClients(data.result.data);
    }
    setLoading(false);
  };

  /*  useEffect(() => {
    fetchClients();
  }, [dispatch]); */

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

  const debouncedFetchClients = useDebouncedCallback((searchValue: string) => {
    fetchClients(0, totalClients, searchValue);
  }, 500);

  useEffect(() => {
    if (searchValue.length) {
      debouncedFetchClients(searchValue);
    } else if (totalClients) {
      //Esta condicion para que no se hagan fetch de mas la primera vez
      setTimeout(() => {
        fetchClients(0, 5, ""); //Contemplando caso luego de borrar una busqueda
      }, 600);
    }
    /* if (clients) {
      const filteredData = clients.filter(
        client =>
          client.ClientCode?.toLowerCase().includes(searchValue.toLowerCase()) ||
          client.ClientFirstname?.toLowerCase().includes(searchValue.toLowerCase()) ||
          client.ClientEmail?.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredClients(filteredData);
    } */
  }, [searchValue /* , clients, setClients */]);

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
        fetchClients,
        totalClients,
        updateClients,
        setClients,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClientsContext = () => useContext(ClientsContext);
