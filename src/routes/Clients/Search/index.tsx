import { ChangeEvent, useEffect, useState } from "react";
import Input from "@/components/Input";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useTranslations } from "next-intl";
import { useClients } from "@/context/ClientsContext";

interface SearchInputProps {
  setFilteredClients: (data: ClientsProps[]) => void;
}

const Search = ({ setFilteredClients }: SearchInputProps) => {
  const { clients } = useClients();
  const [searchValue, setSearchValue] = useState("");
  const dict = useTranslations("dict.clients");

  useEffect(() => {
    const filteredClients = clients.filter(
      client =>
        client.ClientFirstname.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.ClientEmail.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilteredClients(filteredClients);
  }, [searchValue, clients, setFilteredClients]);

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
