"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import addIcon from "../../../public/icons/add.svg";
import { ClientsProvider, useClientsContext } from "@/context/ClientsContext";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useTranslations } from "next-intl";
// Components
import Title from "@/components/Title";
import Button from "@/components/Button";
import PopupActions from "./PopupActions";
import Detail from "./Detail";
import Search from "../../components/Search";
import List from "./List";
import LoadingSpinner from "@/components/Loading";

const ClientsPage = () => {
  const { loading, clients, fetchClients, setClientSelected, clientSelected } = useClientsContext();
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [filteredClients, setFilteredClients] = useState<ClientsProps[]>(clients);
  const dict = useTranslations("dict.clients");

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (filteredClients.length > 0) {
      setClientSelected(filteredClients[0]);
    }
  }, [filteredClients]);

  return (
    <ClientsProvider>
      <section className={styles.container}>
        <div className={styles.inner_container}>
          <Title text={dict("title")} />
          <Search setClients={setFilteredClients} placeholder={dict("search_holder")} />
          <List data={filteredClients} />
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
