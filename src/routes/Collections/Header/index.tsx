import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useCollectionsContext } from "@/context/CollectionsContext";
import { post } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
// Components
import Title from "@/components/Title";
import Search from "@/components/Search";
import Icon from "@/components/Icon";
import PopupChildren from "@/components/PopupChildren";
import Input from "@/components/Input";

const InitialEmptyForm = {
  name: "",
  description: "",
  type_flake: "flake_power_apps",
  flake_id: "",
};

const Header = () => {
  const dict = useTranslations("dict");
  const { collectionsList, setFilteredCollections, filteredCollections, addCollection } = useCollectionsContext();
  const { notify, notifyError } = useMessageToast();
  const [searchValue, setSearchValue] = useState<string>("");
  const [openPopup, setOpenPopup] = useState(false);
  const [form, setForm] = useState(InitialEmptyForm);
  const [errors, setErrors] = useState<{ name?: string; desc?: string }>({});

  useEffect(() => {
    if (searchValue) {
      collectionsList.map(collection => {
        if (collection.name.toLowerCase().includes(searchValue.toLowerCase())) {
          if (filteredCollections === null) {
            setFilteredCollections([collection]);
          } else {
            setFilteredCollections([...filteredCollections, collection]);
          }
        }
      });
    } else {
      setSearchValue("");
      setFilteredCollections(null);
    }
  }, [searchValue]);

  useEffect(() => {
    if (!openPopup) {
      setForm(InitialEmptyForm);
      setErrors({ name: "", desc: "" });
    }

    if (form.name && errors.name) setErrors({ ...errors, name: "" });
    if (form.description && errors.desc) setErrors({ ...errors, desc: "" });
  }, [form, openPopup]);

  const handlePopupChildren = () => {
    setOpenPopup(!openPopup);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSendForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setErrors({ name: dict("collections.header.required"), desc: dict("collections.header.required") });
      return;
    }

    const response = await post("hotlink-collections", form);

    if (response.data.statusCode === 201) {
      notify(dict("collections.new_collection.colection_created"));
      addCollection(response.data.result.hotlinkCollection);
      setOpenPopup(false);
    } else {
      notifyError(dict("collections.new_collection.colection_error"));
    }
  };

  return (
    <div className={styles.container}>
      <Title text={dict("collections.header.title")} />

      <div className={styles.inputs_container}>
        <div className={styles.search_container}>
          <Search
            searchValue={searchValue}
            handleSearchChange={e => setSearchValue(e.target.value)}
            placeholder={dict("collections.header.search")}
          />
        </div>
        <button className={styles.new_btn} onClick={handlePopupChildren}>
          {<Icon name='add' strokeWidth={3} strokeColor='#fff' viewBox='0 0 25 21' />}
          {dict("collections.header.new_btn")}
        </button>
      </div>
      {openPopup && (
        <PopupChildren
          title={dict("collections.header.add_collection")}
          textAccept={dict("popup.create")}
          textCancel={dict("popup.cancel")}
          onCancel={() => setOpenPopup(false)}
          onConfirm={handleSendForm}
          setShowConfirmation={setOpenPopup}
        >
          <Input
            type='text'
            textHolder={dict("collections.header.name")}
            name='name'
            value={form.name}
            handleChange={handleChange}
            ErrorMessage={<p className={errors.name ? styles.error : styles.error_hidden}>{errors.name}</p>}
          />
          <Input
            type='text'
            textHolder={dict("collections.header.description")}
            name='description'
            value={form.description}
            handleChange={handleChange}
            ErrorMessage={<p className={errors.desc ? styles.error : styles.error_hidden}>{errors.desc}</p>}
          />
        </PopupChildren>
      )}
    </div>
  );
};

export default Header;
