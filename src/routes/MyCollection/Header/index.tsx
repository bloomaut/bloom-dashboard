import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useState } from "react";
import hotlink from "@/../public/icons/hotlink_icon.svg";
// Components
import Title from "@/components/Title";
import Search from "@/components/Search";
import Button from "@/components/Button";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const dict = useTranslations("dict.my-collection");

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <Title text='Nombre de la colección' />
        <Search
          searchValue={searchValue}
          handleSearchChange={e => setSearchValue(e.target.value)}
          placeholder={dict("search_holder")}
        />
      </div>
      <div className={styles.column_two}>
        <button>Importar desde Excel</button>
        <Button title={dict("btn")} icon={hotlink} styleName='btn_my_collection' />
      </div>
    </div>
  );
};

export default Header;
