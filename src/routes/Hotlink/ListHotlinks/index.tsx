import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { HotlinkList } from "@/typescript/interfaces/hotlink.interface";
// Components
/* import Search from "@/components/Search"; */
import TableRow from "./TableRow";
import LoadingSpinner from "@/components/Loading";
import Pagination from "@/components/Pagination";
import { get } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";

const ListHotlinks = () => {
  const dict = useTranslations("dict.hotlinks.list");
  /*   const [searchValue, setSearchValue] = useState<string>(""); */
  /*   const [currentItemsFiltered, setCurrentItemsFiltered] = useState<HotlinkList[]>([]); */
  /*   const [filteredHotlinks, setFilteredHotlinks] = useState<HotlinkList[]>([]); */
  const [hotlinkList, setHotlinkList] = useState<HotlinkList[]>([]);
  const [totalHotlinks, setTotalHotlinks] = useState(0);
  const [loading, setLoading] = useState(true);
  const { notifyError } = useMessageToast();

  const getHotlinkList = async (offset: number, limit: number) => {
    const response = await get(`hotlinks/list?limit=${limit}&offset=${offset}`);
    if (response.statusCode === 200) {
      setTotalHotlinks(response.result.hotlinks.total);
      setHotlinkList(response.result.hotlinks.hotlinks);
    } else {
      notifyError(dict("error_tryagain"));
    }
    setLoading(false);
  };

  /*  useEffect(() => {
     let hotlinksList;
    if (searchValue) {
      setFilteredHotlinks([]);
      const fetchAllHotlinks = async () => {
        const response = await getHotlinkList(0, totalHotlinks);
        let hotlinksList = response;
      };
      fetchAllHotlinks();
      hotlinksList.forEach(hotlink => {
        if (
          hotlink.customer?.ClientFirstname?.toLowerCase().includes(searchValue.toLowerCase()) ||
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
  }, [searchValue]); */

  /* const handlePageChangeFilter = (page: number = 1) => {
    const startIndex = (page - 1) * 5;
    const endIndex = startIndex + 5;
    setCurrentItemsFiltered(filteredHotlinks.slice(startIndex, endIndex));
  }; */

  const handlePageChange = async (page: number = 1) => {
    const startIndex = (page - 1) * 5;
    await getHotlinkList(startIndex, 5);
  };

  useEffect(() => {
    handlePageChange();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title_container}>
        <p>{dict("title")}</p>
        {/*
        <Search
          searchValue={searchValue}
          handleSearchChange={e => setSearchValue(e.target.value)}
          placeholder={dict("search")}
        />
        */}
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
          <LoadingSpinner />
        ) : /* filteredHotlinks.length > 0 ? (
          currentItemsFiltered.map((hotlink, index) => <TableRow key={index} hotlink={hotlink} />) // Si existe un hotlink filtrado, se muestra
        ) : */ hotlinkList.length === 0 ? (
          <p className={styles.text}>{dict("empty")}</p> // Si la lista está vacía o no existe, mostramos el texto "empty"
        ) : (
          // Si hay una lista de hotlinks, la mostramos
          hotlinkList.map(hotlink => <TableRow key={hotlink.id} hotlink={hotlink} />)
        )}
      </div>

      {totalHotlinks > 5 && <Pagination totalItems={totalHotlinks} limit={5} onPageChange={handlePageChange} />}
    </div>
  );
};

export default ListHotlinks;
