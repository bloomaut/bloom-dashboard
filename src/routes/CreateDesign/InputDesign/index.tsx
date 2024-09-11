import styles from "./styles.module.scss";

interface Props {
  description: string;
  target: string;
  name: string;
  value: string;
}

const InputDesign = ({ description, target, name, value }: Props) => {
  return (
    <div className={styles.input}>
      <label>{description}</label>
      <input type={target} name={name} value={value} />
    </div>
  );
};

export default InputDesign;
