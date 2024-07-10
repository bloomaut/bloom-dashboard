import styles from "./styles.module.scss";
import Icon from "../Icon";

interface Props {
  textLabel?: string;
  textHolder: string;
  type: string;
  name: string;
  value: string | number;
  isDescription?: boolean;
  className?: string;
  iconSearch?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => void;
  ErrorMessage?: JSX.Element;
  inputPrice?: boolean;
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
  ErrorMessage,
  inputPrice = false,
}: Props) => {
  const inputType = type === "textarea" ? `${styles.input} ${styles.textarea}` : styles.input;

  return (
    <div className={styles.input_container}>
      {textLabel && <label className={styles.label}>{textLabel}</label>}
      {type === "textarea" ? (
        <textarea className={inputType} placeholder={textHolder} name={name} value={value} onChange={handleChange} />
      ) : (
        <>
          <input
            className={`${styles.input} ${isDescription ? styles.description_input : ""} ${className ? styles.search : ""} ${inputPrice ? styles.input_price : ""} `}
            type={type}
            placeholder={textHolder}
            name={name}
            value={value}
            onChange={handleChange}
          />
          {inputPrice && <p className={styles.sign}>$</p>}
        </>
      )}
      <div className={styles.search_container}>
        {iconSearch && (
          <Icon name='search' width={23} height={23} strokeWidth={0.1} fillColor='#7f7f7f' viewBox='0 0 25 25' />
        )}
      </div>
      {ErrorMessage && ErrorMessage}
    </div>
  );
};

export default Input;
