import styles from "./styles.module.scss";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useClientsContext } from "@/context/ClientsContext";
import { useTranslations } from "next-intl";
// Components
import Search from "@/components/Search";
import LoadingSpinner from "@/components/Loading";
import { useEffect } from "react";

const SearchContainer = () => {
  const { searchValue, setSearchValue, loading, clientSelected, setClientSelected, clients, fetchClients } =
    useClientsContext();
  const dict = useTranslations("dict.hotlinks");

  useEffect(() => {
    fetchClients(0, 1000, "");
  }, []);

  return (
    <div className={styles.search_container}>
      <Search
        searchValue={searchValue}
        handleSearchChange={e => setSearchValue(e.target.value)}
        placeholder={dict("search_clients")}
      />
      <div className={styles.clients_container}>
        {loading ? (
          <LoadingSpinner />
        ) : clients.length ? (
          clients.map((client: ClientsProps) => (
            <div
              className={`${styles.row} ${clientSelected && clientSelected._id === client._id ? styles.selected : ""}`}
              key={client._id}
              onClick={() => {
                setClientSelected(client);
              }}
            >
              <div>
                <p>
                  {client.ClientFirstname} {client.ClientLastname}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>{dict("empty_clients")}</p>
        )}
      </div>
    </div>
  );
};

export default SearchContainer;
