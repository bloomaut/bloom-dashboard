import { ChangeEvent, useEffect, useState } from "react";
import Input from "@/components/Input";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";

interface SearchInputProps {
  data: ClientsProps[];
  setFilteredClients: (data: ClientsProps[]) => void;
}

const Search = ({ data, setFilteredClients }: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState("");

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
      textHolder='Buscar cliente'
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
