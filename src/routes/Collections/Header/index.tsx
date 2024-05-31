import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useCollectionsContext } from "@/context/CollectionsContext";
// Components
import Title from "@/components/Title";
import Search from "@/components/Search";
import Icon from "@/components/Icon";

const Header = () => {
  const locale = useLocale();
  const dict = useTranslations("dict.collections.header");
  const { collectionsList, setFilteredCollections, filteredCollections } = useCollectionsContext();
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (searchValue) {
      collectionsList.map(collection => {
        if (collection.name.toLowerCase().includes(searchValue.toLowerCase())) {
          if (filteredCollections === null) {
            setFilteredCollections([collection]);
          } else {
            setFilteredCollections([...filteredCollections, collection]);
          }
        }
      });
    } else {
      setSearchValue("");
      setFilteredCollections(null);
    }
  }, [searchValue]);

  return (
    <div className={styles.container}>
      <Title text={dict("title")} />

      <div className={styles.inputs_container}>
        <div className={styles.search_container}>
          <Search
            searchValue={searchValue}
            handleSearchChange={e => setSearchValue(e.target.value)}
            placeholder={dict("search")}
          />
        </div>
        <div className={styles.period_container}>
          <button className={styles.period}>
            {dict("period_btn")}
            <Icon name='arrow_down_chevron' strokeWidth={1.5} viewBox='0 0 18 8' />
          </button>

          <div className={styles.period}>
            <Icon name='bar' width={10} height={25} strokeWidth={2} strokeColor='#bebebe' viewBox='0 0 10 30' />
            <Icon name='period' strokeWidth={2} viewBox='0 0 20 20' strokeColor='#ff5722' />
          </div>
        </div>
        <Link href={`/${locale}/collections/new-collection`} className={styles.new_btn}>
          {<Icon name='plus' strokeWidth={3} strokeColor='#fff' viewBox='0 0 25 21' />}
          {dict("new_btn")}
        </Link>
      </div>
    </div>
  );
};

export default Header;
