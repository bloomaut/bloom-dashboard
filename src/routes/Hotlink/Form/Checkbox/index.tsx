import styles from "./styles.module.scss";
import { useState } from "react";
import { useTranslations } from "next-intl";
// Components
import SearchContainer from "../SearchContainer";

const Checkbox = () => {
  const [isChecked, setIsChecked] = useState(false);
  const dict = useTranslations("dict.hotlinks");

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  return (
    <>
      <div className={styles.checkbox_container}>
        <input type='checkbox' id='checkbox' checked={isChecked} onChange={handleCheckboxChange} />
        <label htmlFor='checkbox'>{dict("title_checkbox")}</label>
        <p>*{dict("subtitle_checkbox")}</p>
      </div>
      {isChecked && <SearchContainer />}
    </>
  );
};

export default Checkbox;
