import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useCollectionsContext } from "@/context/CollectionsContext";
// Component
import Title from "@/components/Title";
import Search from "@/components/Search";
// Iconos
import down from "@/../public/icons/IconDown.svg";
import bar from "@/../public/icons/bar.svg";
import period from "@/../public/icons/period.svg";
import plus from "@/../public/icons/plus.svg";
import { Fade } from "react-awesome-reveal";

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
      <Fade>
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
              <Image src={down} alt='' />
            </button>

            <div className={styles.period}>
              <Image src={bar} alt='' />
              <Image src={period} alt='' />
            </div>
          </div>
          <Link href={`/${locale}/collections/new-collection`} className={styles.new_btn}>
            <Image src={plus} alt='' width={15} height={15} />
            {dict("new_btn")}
          </Link>
        </div>
      </Fade>
    </div>
  );
};

export default Header;
