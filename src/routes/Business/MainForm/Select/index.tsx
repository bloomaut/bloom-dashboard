import styles from "./styles.module.scss";
import { categories } from "@/utils/categories";

interface CategoriesPros {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({ name, value, onChange }: CategoriesPros) => {
  return (
    <select className={styles.select} name={name} value={value} onChange={onChange}>
      {categories.map((category, index) => (
        <optgroup className={styles.option_group} key={index} label={category.label}>
          {category.options.map(option => (
            <option className={styles.option} key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

export default Select;
