"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Title from "@/components/Title";
import Button from "@/components/Button";
import addIcon from "../../../public/icons/add.svg";
import PopupActions from "./PopupActions";
import Detail from "./Detail";
import Search from "../../components/Search";
import List from "./List";
import { ClientsProvider, useClients } from "@/context/ClientsContext";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useTranslations } from "next-intl";

const ClientsPage = () => {
  const { clients, fetchClients } = useClients();
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [clientSelected, setClientSelected] = useState<ClientsProps | null>(null);
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
          <List data={filteredClients} setClientSelected={setClientSelected} />
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
              setClientSelected={setClientSelected}
              onCancel={() => setShowPopupCreate(false)}
            />
          )}
        </div>
        {clientSelected && <Detail client={clientSelected} />}
      </section>
    </ClientsProvider>
  );
};

export default ClientsPage;
