import { ChangeEvent, useEffect, useState } from "react";
import Input from "@/components/Input";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useTranslations } from "next-intl";

interface SearchInputProps {
  data: ClientsProps[];
  setFilteredClients: (data: ClientsProps[]) => void;
}

const Search = ({ data, setFilteredClients }: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState("");
  const dict = useTranslations("dict.clients");

  useEffect(() => {
    const filteredClients = data.filter(
      client =>
        client.ClientFirstname.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.ClientEmail.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilteredClients(filteredClients);
  }, [searchValue, data, setFilteredClients]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setSearchValue(e.target.value);
  };

  return (
    <Input
      textHolder={dict("search_holder")}
      type='text'
      name='search'
      value={searchValue}
      handleChange={handleSearchChange}
      className='search'
      iconSearch
    />
  );
};

export default Search;
