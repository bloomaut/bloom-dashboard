import { ChangeEvent, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Input from "@/components/Input";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useAppSelector } from "@/store/hooks";

interface SearchInputProps {
  setClients: (clients: ClientsProps[]) => void;
}

const Search = ({ setClients }: SearchInputProps) => {
  const clients = useAppSelector(state => state.clients);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const filteredClients = clients.filter(
      client =>
        client.ClientFirstname.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.ClientEmail.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setClients(filteredClients);
  }, [searchValue, clients, setClients]);

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
