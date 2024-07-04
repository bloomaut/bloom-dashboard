import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
import { HotlinkList } from "@/typescript/interfaces/hotlink.interface";
// Components
import Search from "@/components/Search";
import TableRow from "./TableRow";
import LoadingSpinner from "@/components/Loading";
import Pagination from "@/components/Pagination";

const ListHotlinks = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const dict = useTranslations("dict.hotlinks.list");
  const { hotlinksList, filteredHotlinks, setFilteredHotlinks, loading } = useFlakesContext();
  const [currentItems, setCurrentItems] = useState<HotlinkList[]>([]);

  useEffect(() => {
    if (searchValue) {
      hotlinksList.map(hotlink => {
        if (hotlink.customer?.ClientFirstname?.toLowerCase().includes(searchValue.toLowerCase())) {
          setFilteredHotlinks(hotlink);
        } else if (hotlink.flake_power_app.skinx.title.toLowerCase().includes(searchValue.toLowerCase())) {
          setFilteredHotlinks(hotlink);
        }
      });
    } else {
      setSearchValue("");
      setFilteredHotlinks(null);
    }
  }, [searchValue]);

  const handlePageChange = (page: number = 1, itemsPerPage: number = 5) => {
    //Cantidad por default de items = 5 y pagina default= 1
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentItems(hotlinksList.slice(startIndex, endIndex));
  };

  useEffect(() => {
    handlePageChange();
  }, [hotlinksList]);

  return (
    <div className={styles.container}>
      <div className={styles.title_container}>
        <p>{dict("title")}</p>
        <Search
          searchValue={searchValue}
          handleSearchChange={e => setSearchValue(e.target.value)}
          placeholder={dict("search")}
        />
      </div>
      {/* TABLA */}
      <div className={styles.table_container}>
        <h4>{dict("title_one")}</h4>
        <h4>{dict("title_two")}</h4>
        <h4>{dict("title_three")}</h4>
        <h4></h4>
      </div>
      <div className={styles.rows_container}>
        {loading ? (
          <LoadingSpinner /> // Si está cargando, mostramos el spinner
        ) : filteredHotlinks ? (
          <TableRow key={filteredHotlinks.id} hotlink={filteredHotlinks} /> // Si existe un hotlink filtrado, se muestra
        ) : !hotlinksList || hotlinksList.length === 0 ? (
          <p className={styles.text}>{dict("empty")}</p> // Si la lista está vacía o no existe, mostramos el texto "empty"
        ) : (
          // Si hay una lista de hotlinks, la mostramos
          currentItems.map(hotlink => <TableRow key={hotlink.id} hotlink={hotlink} />)
        )}
      </div>
      {!filteredHotlinks && (
        <Pagination totalItems={hotlinksList.length} itemsPerPage={5} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default ListHotlinks;
