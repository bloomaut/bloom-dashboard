import styles from "./styles.module.scss";

interface Props {
  description: string;
  target: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (name: string, value: string) => void;
}

const InputDesign = ({ description, target, name, value, disabled = false, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value);
  };

  return (
    <div className={styles.input}>
      <label>{description}</label>
      <input type={target} name={name} value={value} disabled={disabled} onChange={handleChange} />
    </div>
  );
};

export default InputDesign;
