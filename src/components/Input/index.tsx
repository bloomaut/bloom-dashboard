import styles from "./styles.module.scss";

interface Props {
  textLabel: string;
  textHolder: string;
  type: string;
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index?: number) => void;
  isDescription?: boolean;
}

const Input = ({ textLabel, textHolder, type, name, value, handleChange, isDescription }: Props) => {
  return (
    <div className={styles.input_container}>
      <label className={styles.label}>{textLabel}</label>
      <input
        className={`${styles.input} ${isDescription ? styles.description_input : ""}`} // Aquí aplicamos la clase adicional si esDescription es verdadero
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
