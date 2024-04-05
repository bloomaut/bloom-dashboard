import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useState } from "react";
import hotlink from "@/../public/icons/hotlink_icon.svg";
import excel from "@/../public/icons/excel_logo.svg";
import table from "@/../public/icons/excel.svg";
// Components
import Title from "@/components/Title";
import Search from "@/components/Search";
import Button from "@/components/Button";
import { useCollectionsContext } from "@/context/CollectionsContext";
import { useParams } from "next/navigation";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const dict = useTranslations("dict.my-collection");
  const { id } = useParams();
  const { collectionsList } = useCollectionsContext();

  const data = collectionsList.filter(collection => collection._id === id);

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <Title text={data[0].name} />
        <Search
          searchValue={searchValue}
          handleSearchChange={e => setSearchValue(e.target.value)}
          placeholder={dict("search_holder")}
        />
      </div>
      <div className={styles.column_two}>
        <div className={styles.btn_container}>
          <Button title={dict("btn3")} icon={table} styleName='btn_copy' />
          <Button title={dict("btn2")} icon={excel} styleName='btn_excel' />
        </div>
        <Button title={dict("btn")} icon={hotlink} styleName='btn_my_collection' />
      </div>
    </div>
  );
};

export default Header;
