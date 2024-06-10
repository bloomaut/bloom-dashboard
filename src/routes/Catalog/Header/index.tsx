import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { ChangeEvent, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { post } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";
import { useMessageToast } from "@/hooks/useMessageToast";
// Components
import Title from "@/components/Title";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import PopupChildren from "@/components/PopupChildren";
import Input from "@/components/Input";

const Header = () => {
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dict = useTranslations("dict");
  const schema = useAppSelector(state => state.dataschema);
  const { notify, notifyError } = useMessageToast();

  const onChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleCreate = () => {
    setShowPopupCreate(true);
    setInputValue("");
  };

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postDataschema = {
      name: inputValue,
      dataschema: schema[0]._id,
      order: 0,
    };
    const response = await post("datasets", postDataschema, ENV.BOX);
    if (response.data.statusCode === 201) {
      notify(dict("toast.post_dataset"));
    } else {
      notifyError(dict("toast.error_dataset"));
    }
    setShowPopupCreate(false);
  };

  return (
    <div className={styles.header}>
      <Title text={dict("catalog.title")} />
      <div className={styles.btn_container}>
        <Button
          title={dict("catalog.ia")}
          icon={<Icon name='ia' strokeColor='#7f7f7f' viewBox='0 0 25 21' />}
          styleName='btn_outline'
        />
        <Button
          title={dict("catalog.new")}
          icon={<Icon name='add' strokeWidth={3} strokeColor='#fff' viewBox='0 0 25 21' />}
          styleName='btn_reverse'
          onclick={handleCreate}
        />
        {showPopupCreate && (
          <PopupChildren
            title={dict("catalog.new")}
            textAccept={dict("popup.create")}
            textCancel={dict("popup.cancel")}
            onCancel={() => setShowPopupCreate(false)}
            onConfirm={submitPost}
            setShowConfirmation={setShowPopupCreate}
            children={
              <Input
                type='text'
                name='Name'
                textHolder={dict("popup.name")}
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
