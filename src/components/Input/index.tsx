import styles from "./styles.module.scss";
import searchIcon from "../../../public/icons/search.svg";
import Image from "next/image";

interface Props {
  textLabel?: string;
  textHolder: string;
  type: string;
  name: string;
  value: string;
  isDescription?: boolean;
  className?: string;
  iconSearch?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index?: number) => void;
}

const Input = ({
  textLabel,
  textHolder,
  type,
  name,
  value,
  handleChange,
  className,
  isDescription,
  iconSearch = false,
}: Props) => {
  return (
    <div className={styles.input_container}>
      <label className={styles.label}>{textLabel}</label>
      <input
        className={`${styles.input} ${isDescription ? styles.description_input : ""} ${className ? styles.search : ""}`}
        type={type}
        name={name}
        placeholder={textHolder}
        value={value}
        onChange={handleChange}
      />
      {iconSearch && (
        <div className={styles.search_container} onClick={() => alert("Clicked me")}>
          <Image src={searchIcon} alt='Search Icon' className={styles.search_icon} />
        </div>
      )}
    </div>
  );
};

export default Input;
