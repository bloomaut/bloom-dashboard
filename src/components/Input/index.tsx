import styles from "./styles.module.scss";

interface Props {
  textLabel: string;
  textHolder: string;
  type: string;
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index?: number) => void;
}

const Input = ({ textLabel, textHolder, type, name, value, handleChange }: Props) => {
  return (
    <div className={styles.input_container}>
      <label className={styles.label}>{textLabel}</label>
      <input
        className={styles.input}
        type={type}
        name={name}
        placeholder={textHolder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default Input;
