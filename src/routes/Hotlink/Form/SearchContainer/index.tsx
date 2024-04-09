import styles from "./styles.module.scss";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useClientsContext } from "@/context/ClientsContext";
import { useTranslations } from "next-intl";

import Search from "@/components/Search";
import LoadingSpinner from "@/components/Loading";

const SearchContainer = () => {
  const { searchValue, setSearchValue } = useClientsContext();
  const { loading, setClientSelected, filteredClients } = useClientsContext();
  const dict = useTranslations("dict.hotlinks");

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
        ) : filteredClients.length ? (
          filteredClients.map((client: ClientsProps) => (
            <div className={styles.row} key={client._id}>
              <div onClick={() => setClientSelected(client)}>
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
