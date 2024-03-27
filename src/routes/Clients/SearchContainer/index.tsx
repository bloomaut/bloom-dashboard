"use client";
import Search from "@/components/Search";
import { useClientsContext } from "@/context/ClientsContext";
import { useTranslations } from "next-intl";

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
