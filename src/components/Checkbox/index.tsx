import styles from "./styles.module.scss";

interface CheckBoxProps {
  active: boolean;
  text?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckBox = ({ active, text, onChange }: CheckBoxProps) => {
  return (
    <div className={styles.switch_button}>
      <input type='checkbox' id='switch-checkbox' className={styles.checkbox} checked={active} onChange={onChange} />
      <label htmlFor='switch-checkbox' className={styles.label}></label>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default CheckBox;
