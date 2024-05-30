import styles from "./styles.module.scss";
import Icon from "../Icon";

interface Props {
  textLabel?: string;
  textHolder: string;
  type: string;
  name: string;
  value: string;
  isDescription?: boolean;
  className?: string;
  iconSearch?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => void;
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
        {iconSearch && <Icon name='search' strokeWidth={0.1} fillColor='#381d2a' viewBox='0 0 25 20' />}
      </div>
    </div>
  );
};

export default Input;
