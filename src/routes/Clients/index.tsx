"use client";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import { ClientsProvider } from "@/context/ClientsContext";
import { useTranslations } from "next-intl";
import { useState } from "react";
// Components
import Title from "@/components/Title";
import Button from "@/components/Button";
import PopupActions from "./PopupActions";
import Detail from "./Detail";
import List from "./List";
import SearchContainer from "./SearchContainer";

const ClientsPage = () => {
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const dict = useTranslations("dict.clients");

  return (
    <ClientsProvider>
      <section className={styles.container}>
        <div className={styles.inner_container}>
          <Title text={dict("title")} />
          <SearchContainer />
          <List />
          <div className={styles.btn_container}>
            <Button
              title={dict("button")}
              styleName='btn_outline'
              onclick={() => setShowPopupCreate(true)}
              icon={<Icon name='add' viewBox='0 0 25 20' strokeColor='#7f7f7f' />}
            />
          </div>
          {showPopupCreate && (
            <PopupActions
              requestType='POST'
              title={dict("popup_create_title")}
              buttonText={dict("popup_button")}
              setShowPopup={setShowPopupCreate}
              onCancel={() => setShowPopupCreate(false)}
            />
          )}
        </div>
        <Detail />
      </section>
    </ClientsProvider>
  );
};

export default ClientsPage;
