import styles from "./styles.module.scss";

interface Props {
  description: string;
  target: string;
  name: string;
  value: string;
  disabled?: boolean;
}

const InputDesign = ({ description, target, name, value, disabled = false }: Props) => {
  return (
    <div className={styles.input}>
      <label>{description}</label>
      <input type={target} name={name} value={value} disabled={disabled} />
    </div>
  );
};

export default InputDesign;
