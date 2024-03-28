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
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number | undefined,
  ) => void;
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
  const inputType = type === "textarea" ? `${styles.input} ${styles.textarea}` : styles.input;

  return (
    <div className={styles.input_container}>
      {textLabel && <label className={styles.label}>{textLabel}</label>}
      {type === "textarea" ? (
        <textarea className={inputType} placeholder={textHolder} name={name} value={value} onChange={handleChange} />
      ) : (
        <input
          className={`${styles.input} ${isDescription ? styles.description_input : ""} ${className ? styles.search : ""}`}
          type={type}
          placeholder={textHolder}
          name={name}
          value={value}
          onChange={handleChange}
        />
      )}
      <div className={styles.search_container}>
        {iconSearch && <Image src={searchIcon} alt='Search Icon' className={styles.search_icon} />}
      </div>
    </div>
  );
};

export default Input;
