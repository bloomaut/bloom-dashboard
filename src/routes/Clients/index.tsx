"use client";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import addIcon from "../../../public/icons/add.svg";
import { ClientsProvider, useClientsContext } from "@/context/ClientsContext";
import { useTranslations } from "next-intl";
// Components
import Title from "@/components/Title";
import Button from "@/components/Button";
import PopupActions from "./PopupActions";
import Detail from "./Detail";
import List from "./List";
import SearchContainer from "./SearchContainer";

const ClientsPage = () => {
  const { fetchClients } = useClientsContext();
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const dict = useTranslations("dict.clients");

  useEffect(() => {
    fetchClients();
  }, []);

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
              icon={addIcon}
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
