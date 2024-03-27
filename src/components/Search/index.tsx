import { ChangeEvent, useEffect, useState } from "react";
import Input from "@/components/Input";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { CollectionProps } from "@/typescript/interfaces/collection.interface";
import { useClients } from "@/context/ClientsContext";
import { usePathname } from "next/navigation";

interface SearchProps {
  setClients?: (data: ClientsProps[]) => void;
  setCollections?: (data: CollectionProps[]) => void;
  placeholder: string;
}

const Search = ({ setClients, setCollections, placeholder }: SearchProps) => {
  const { clients } = useClients();
  // const { collections } = useCollections();
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();

  if (pathname.includes("clients") && setClients) {
    useEffect(() => {
      const filteredData = clients.filter(
        client =>
          client.ClientFirstname.toLowerCase().includes(searchValue.toLowerCase()) ||
          client.ClientEmail.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setClients(filteredData);
    }, [searchValue, clients, setClients]);
  }

  if (pathname.includes("collections") && setCollections) {
    console.log("Logica para filtrar colecciones");
    // useEffect(() => {
    //   const filteredData = collections.filter(
    //     collection =>
    //       collection.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    //       collection.name_skin.toLowerCase().includes(searchValue.toLowerCase()),
    //   );
    //   setCollections(filteredData);
    // }, [searchValue, collections, setClients]);
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setSearchValue(e.target.value);
  };

  return (
    <Input
      textHolder={placeholder}
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
