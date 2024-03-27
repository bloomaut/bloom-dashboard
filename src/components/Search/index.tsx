import Input from "@/components/Input";
import { ChangeEvent } from "react";

interface SearchProps {
  searchValue: string;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
}

const Search = ({ searchValue, handleSearchChange, placeholder }: SearchProps) => {
  return (
    <Input
      textHolder={placeholder}
      type='text'
      name='search'
      value={searchValue}
      handleChange={e => handleSearchChange(e)}
      className='search'
      iconSearch
    />
  );
};

export default Search;
