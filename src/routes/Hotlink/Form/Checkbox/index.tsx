import styles from "./styles.module.scss";
import { useState } from "react";
//Componentes
import SearchContainer from "../SearchContainer";

const Checkbox = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  return (
    <>
      <div className={styles.checkbox_container}>
        <input type='checkbox' id='checkbox' checked={isChecked} onChange={handleCheckboxChange} />
        <label htmlFor='checkbox'>Llenar variables con cliente</label>
        <p>*Campos que se puedan completar con cliente</p>
      </div>
      {isChecked && <SearchContainer />}
    </>
  );
};

export default Checkbox;
