import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.scss";
import DragAndDrop from "@/components/DragAndDrop";

interface Props {
  description: string;
  target: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (name: string, value: string) => void;
  file?: File | null;
  setFile?: Dispatch<SetStateAction<File | null>>;
}

const InputDesign = ({ description, target, name, value, disabled = false, onChange, file, setFile }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (target === "text") {
      onChange(name, e.target.value);
    }
  };

  return (
    <div className={styles.input}>
      <label>{description}</label>
      {target === "image" ? (
        <DragAndDrop type='image' file={file || null} setFile={setFile!} />
      ) : (
        <input type={target} name={name} value={value} disabled={disabled} onChange={handleChange} />
      )}
    </div>
  );
};

export default InputDesign;
