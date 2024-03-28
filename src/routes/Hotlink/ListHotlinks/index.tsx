import styles from "./styles.module.scss";
import Search from "@/components/Search";
import { useClientsContext } from "@/context/ClientsContext";

const ListHotlinks = () => {
  const { searchValue, setSearchValue } = useClientsContext();

  return (
    <div className={styles.container}>
      <div className={styles.text_container}>
        <p>Hotlink List</p>
        <Search
          searchValue={searchValue}
          handleSearchChange={e => setSearchValue(e.target.value)}
          placeholder='Buscar Clientes'
        />
      </div>
    </div>
  );
};

export default ListHotlinks;
