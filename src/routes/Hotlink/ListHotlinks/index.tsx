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
  const dict = useTranslations("dict.hotlinks.list");
  const { hotlinksList, filteredHotlinks, setFilteredHotlinks, loading } = useFlakesContext();
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentItems, setCurrentItems] = useState<HotlinkList[]>([]);
  const [currentItemsFiltered, setCurrentItemsFiltered] = useState<HotlinkList[]>([]);

  useEffect(() => {
    if (searchValue) {
      setFilteredHotlinks([]);
      hotlinksList.forEach(hotlink => {
        if (
          hotlink.customer?.clientFirstname?.toLowerCase().includes(searchValue.toLowerCase()) ||
          hotlink.flake_power_app.skinx.title.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          setFilteredHotlinks(prevItems => {
            if (!prevItems.some(item => item.id === hotlink.id)) {
              return [...prevItems, hotlink];
            }
            return prevItems;
          });
        }
      });
    } else {
      setSearchValue("");
      setFilteredHotlinks([]);
    }
  }, [searchValue]);

  const handlePageChange = (page: number = 1, itemsPerPage: number = 5) => {
    //Cantidad por default de items = 5 y pagina default= 1
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentItems(hotlinksList.slice(startIndex, endIndex));
  };
  const handlePageChangeFilter = (page: number = 1, itemsPerPage: number = 5) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentItemsFiltered(filteredHotlinks.slice(startIndex, endIndex));
  };

  useEffect(() => {
    handlePageChange();
    handlePageChangeFilter();
  }, [hotlinksList, filteredHotlinks]);

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
        ) : filteredHotlinks.length > 0 ? (
          currentItemsFiltered.map((hotlink, index) => <TableRow key={index} hotlink={hotlink} />) // Si existe un hotlink filtrado, se muestra
        ) : !hotlinksList || hotlinksList.length === 0 ? (
          <p className={styles.text}>{dict("empty")}</p> // Si la lista está vacía o no existe, mostramos el texto "empty"
        ) : (
          // Si hay una lista de hotlinks, la mostramos
          currentItems.map(hotlink => <TableRow key={hotlink.id} hotlink={hotlink} />)
        )}
      </div>

      {filteredHotlinks.length === 0 && //Paginacion inicial
        hotlinksList.length > 5 && (
          <Pagination totalItems={hotlinksList.length} itemsPerPage={5} onPageChange={handlePageChange} />
        )}
      {filteredHotlinks.length > 0 && //Paginacion al filtrar
        filteredHotlinks.length > 5 && (
          <Pagination totalItems={filteredHotlinks.length} itemsPerPage={5} onPageChange={handlePageChangeFilter} />
        )}
    </div>
  );
};

export default ListHotlinks;
