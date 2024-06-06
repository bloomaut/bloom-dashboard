import Title from "@/components/Title";
import styles from "./styles.module.scss";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PopupChildren from "@/components/PopupChildren";
import Input from "@/components/Input";
import { useCatalogContext } from "@/context/CatalogContext";

const Header = () => {
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const { dataschemas, postDataschema } = useCatalogContext();
  const [inputValue, setInputValue] = useState("");
  const dict = useTranslations("dict.catalog");
  const dictpopup = useTranslations("dict.popup");

  const onChangeInput = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleCreate = () => {
    setShowPopupCreate(true);
    setInputValue("");
  };
  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await postDataschema(inputValue, dataschemas[0]._id);
    } catch (error) {
      console.error("Error posting dataset:", error);
    } finally {
      setShowPopupCreate(false);
    }
  };

  return (
    <div className={styles.header}>
      <Title text={dict("title")} />
      <div className={styles.btn_container}>
        <Button
          title={dict("ia")}
          icon={<Icon name='ia' strokeColor='#7f7f7f' viewBox='0 0 25 21' />}
          styleName='btn_outline'
        />
        <Button
          title={dict("new")}
          icon={<Icon name='add' strokeWidth={3} strokeColor='#fff' viewBox='0 0 25 21' />}
          styleName='btn_reverse'
          onclick={handleCreate}
        />
        {showPopupCreate && (
          <PopupChildren
            title={dict("new")}
            textAccept={dictpopup("create")}
            textCancel={dictpopup("cancel")}
            onCancel={() => setShowPopupCreate(false)}
            onConfirm={submitPost}
            setShowConfirmation={setShowPopupCreate}
            children={
              <Input
                type='text'
                name='Name'
                textHolder={dictpopup("name")}
                value={inputValue}
                handleChange={onChangeInput}
              />
            }
          />
        )}
      </div>
    </div>
  );
};

export default Header;
