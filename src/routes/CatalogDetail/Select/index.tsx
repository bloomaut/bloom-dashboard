import { selectOptions } from "@/typescript/interfaces/catalog.interface";
import styles from "./styles.module.scss";

interface DetailProps {
  options: Array<selectOptions>;
  placeholder: string;
}

const Select = ({ options, placeholder }: DetailProps) => {
  return (
    <select className={styles.select_container}>
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
