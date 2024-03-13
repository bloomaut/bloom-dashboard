import styles from "./styles.module.scss";

interface Props {
  textLabel: string;
  textHolder: string;
  type: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ textLabel, textHolder, type, value, handleChange }: Props) => {
  return (
    <div className={styles.input_container}>
      <label className={styles.label}>{textLabel}</label>
      <input className={styles.input} type={type} placeholder={textHolder} value={value} onChange={handleChange} />
    </div>
  );
};

export default Input;
