import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { get } from "@/services/fetch";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useDebouncedCallback } from "use-debounce";
import { useAppSelector } from "@/store/hooks";

interface ClientsContextType {
  clients: ClientsProps[];
  loading: boolean;
  clientSelected: ClientsProps | null;
  setClientSelected: Dispatch<SetStateAction<ClientsProps | null>>;
  searchValue: string;
  setSearchValue: (i: string) => void;
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
  /* Para buscador */
  const [searchValue, setSearchValue] = useState<string>("");
  const { clientId } = useAppSelector(state => state.ricardosData);

  console.log(clientId);

  const fetchClients = async (offset: number, limit: number, search: string = "") => {
    const data = await get(`client-customer?limit=${limit}&offset=${offset}&search=${search}`);
    if (data.statusCode === 200) {
      setTotalClients(data.result.total);
      setClients(data.result.data);
    }
    setLoading(false);
  };

  const updateClients = (newClient: ClientsProps) => {
    setClients(prevClients => {
      const index = prevClients.findIndex(client => client._id === newClient._id);
      if (index > -1) {
        // Cliente existe, reemplazar el cliente existente
        return prevClients.map((client, i) => (i === index ? newClient : client));
      } else {
        // Cliente no existe, agregar el nuevo cliente al array
        return [newClient, ...prevClients];
      }
    });
  };

  const debouncedFetchClients = useDebouncedCallback((searchValue: string) => {
    fetchClients(0, 8, searchValue);
  }, 500);

  useEffect(() => {
    if (searchValue.length) {
      debouncedFetchClients(searchValue);
    } else if (totalClients) {
      //Esta condicion para que no se hagan fetch de mas la primera vez
      setTimeout(() => {
        fetchClients(0, 8, ""); //Contemplando caso luego de borrar una busqueda
      }, 600);
    }
  }, [searchValue, clientId]);

  return (
    <ClientsContext.Provider
      value={{
        clients,
        loading,
        clientSelected,
        setClientSelected,
        searchValue,
        setSearchValue,
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
