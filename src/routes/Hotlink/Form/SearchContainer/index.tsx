import styles from "./styles.module.scss";
import Search from "@/components/Search";
import { useClientsContext } from "@/context/ClientsContext";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import LoadingSpinner from "@/components/Loading";

const SearchContainer = () => {
  const { searchValue, setSearchValue } = useClientsContext();
  const { loading, setClientSelected, filteredClients } = useClientsContext();

  return (
    <div className={styles.search_container}>
      <Search
        searchValue={searchValue}
        handleSearchChange={e => setSearchValue(e.target.value)}
        placeholder='Buscar Clientes'
      />
      <div className={styles.clients_container}>
        {loading ? (
          <LoadingSpinner />
        ) : filteredClients.length ? (
          filteredClients.map((client: ClientsProps) => (
            <div className={styles.row}>
              <div onClick={() => setClientSelected(client)}>
                <p>{client.ClientFirstname}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>No hay clientes</p>
        )}
      </div>
    </div>
  );
};

export default SearchContainer;
