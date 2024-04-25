import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useFlakesContext } from "@/context/FlakesContext";
import { useEffect, useState } from "react";
// Components
import Search from "@/components/Search";
import TableRow from "./TableRow";
import Loading from "@/app/[locale]/(playground)/introduction/loading";

const ListHotlinks = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const dict = useTranslations("dict.hotlinks.list");
  const { hotlinksList, filteredHotlinks, setFilteredHotlinks, loading } = useFlakesContext();

  useEffect(() => {
    if (searchValue) {
      hotlinksList.map(hotlink => {
        if (hotlink.customer?.ClientFirstname?.toLowerCase().includes(searchValue.toLowerCase())) {
          setFilteredHotlinks(hotlink);
        }
      });
    } else {
      setSearchValue("");
      setFilteredHotlinks(null);
    }
  }, [searchValue]);

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
        <h4>{dict("title_four")}</h4>
      </div>
      <div className={styles.rows_container}>
        {loading ? (
          <Loading />
        ) : !filteredHotlinks || (hotlinksList && hotlinksList.length === 0) || !hotlinksList ? (
          <p className={styles.text}>{dict("empty")}</p>
        ) : filteredHotlinks ? (
          <TableRow key={filteredHotlinks.id} hotlink={filteredHotlinks} />
        ) : (
          hotlinksList.map(hotlink => {
            return <TableRow key={hotlink.id} hotlink={hotlink} />;
          })
        )}
      </div>
    </div>
  );
};

export default ListHotlinks;
