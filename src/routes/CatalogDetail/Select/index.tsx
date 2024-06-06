import { selectOptions } from "@/typescript/interfaces/catalog.interface";
import styles from "./styles.module.scss";

interface DetailProps {
  options: Array<selectOptions>;
  placeholder: string;
  onchange: (e: string) => void;
}

const Select = ({ options, placeholder, onchange }: DetailProps) => {
  return (
    <select className={styles.select_container} onChange={e => onchange(e.target.value)}>
      <option disabled selected hidden>
        {placeholder}
      </option>
      {options.map(op => {
        return (
          <option key={op.title} value={op.value}>
            {op.title}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
