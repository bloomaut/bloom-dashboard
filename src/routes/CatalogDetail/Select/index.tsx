import { SelectOption } from "@/typescript/interfaces/catalog.interface";
import styles from "./styles.module.scss";

interface DetailProps {
  options: Array<SelectOption>;
  placeholder: string;
  onChange: (value: string) => void;
}

const Select = ({ options, placeholder, onChange }: DetailProps) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select className={styles.select_container} onChange={handleSelectChange} value=''>
      <option value='' disabled hidden>
        {placeholder}
      </option>
      {options.map(op => (
        <option key={op.value} value={op.value}>
          {op.title}
        </option>
      ))}
    </select>
  );
};

export default Select;
