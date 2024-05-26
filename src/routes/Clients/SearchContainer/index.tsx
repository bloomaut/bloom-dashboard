"use client";
import { useClientsContext } from "@/context/ClientsContext";
import { useTranslations } from "next-intl";
// Components
import Search from "@/components/Search";

const SearchContainer = () => {
  const { searchValue, setSearchValue } = useClientsContext();
  const dict = useTranslations("dict.clients");

  return (
    <Search
      searchValue={searchValue}
      handleSearchChange={e => setSearchValue(e.target.value)}
      placeholder={dict("search_holder")}
    />
  );
};

export default SearchContainer;
