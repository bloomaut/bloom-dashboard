import { useCatalogContext } from "@/context/CatalogContext";
import Header from "./Header";
import styles from "./styles.module.scss";
import Card from "./Card";
import LoadingSpinner from "@/components/Loading";
import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import { ChangeEvent, useState } from "react";
import { post } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { useAppSelector } from "@/store/hooks";
import { ENV } from "@/typescript/types/api";
import PopupChildren from "@/components/PopupChildren";
import Input from "@/components/Input";

const Catalog = () => {
  const { datasets, fetchDatasets, loading } = useCatalogContext();
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const { notify, notifyError } = useMessageToast();
  const schema = useAppSelector(state => state.dataschema);
  const dict = useTranslations("dict");

  const onChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleCreate = () => {
    setShowPopupCreate(true);
    setInputValue("");
  };

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoadingForm(true);
    e.preventDefault();
    const postDataschema = {
      name: inputValue,
      dataschema: schema[0]._id,
      order: 0,
    };
    const response = await post("datasets", postDataschema, ENV.BOX);
    if (response.data.statusCode === 201) {
      notify(dict("toast.post_dataset"));
      fetchDatasets();
    } else {
      notifyError(dict("toast.error_dataset"));
    }
    setLoadingForm(false);
    setShowPopupCreate(false);
  };

  return (
    <div className={styles.catalog_container}>
      <Header />
      <div className={styles.cards_container}>
        {loading ? (
          <LoadingSpinner />
        ) : datasets.length ? (
          <>
            {datasets.map(dataset => (
              <Card key={dataset._id} {...dataset} />
            ))}
            <div className={styles.add} onClick={handleCreate}>
              <Icon name='add' viewBox='0 0 20 22' width={50} height={50} strokeWidth={1.5} strokeColor='#282E7E' />
            </div>
          </>
        ) : (
          <p>{dict("catalog.empty_datasets")}</p>
        )}
        {showPopupCreate && (
          <PopupChildren
            title={dict("catalog.new")}
            textAccept={dict("popup.create")}
            textCancel={dict("popup.cancel")}
            onCancel={() => setShowPopupCreate(false)}
            loading={loadingForm}
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

export default Catalog;
