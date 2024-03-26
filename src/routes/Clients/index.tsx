"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Title from "@/components/Title";
import Button from "@/components/Button";
import addIcon from "../../../public/icons/add.svg";
import PopupActions from "./PopupActions";
import Detail from "./Detail";
import Search from "./Search";
import List from "./List";
import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setClientsData } from "@/store/features/clients";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useTranslations } from "next-intl";

const ClientsPage = () => {
  const clients = useAppSelector(state => state.clients);
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [clientSelected, setClientSelected] = useState<ClientsProps | null>(null);
  const [filteredClients, setFilteredClients] = useState<ClientsProps[]>(clients);
  const dict = useTranslations("dict.clients");
  const dispatch = useAppDispatch();

  const getClients = async () => {
    const data = await get("client-customer", ENV.DASH);
    if (data.statusCode === 200) {
      dispatch(setClientsData(data.result.data));
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, [dispatch]);

  useEffect(() => {
    if (clients.length > 0) {
      setClientSelected(clients[0]);
    }
  }, [clients]);

  return (
    <section className={styles.container}>
      <div className={styles.inner_container}>
        <Title text={dict("title")} />
        <Search data={clients} setFilteredClients={setFilteredClients} />
        <List data={filteredClients} loading={loading} setClientSelected={setClientSelected} fetch={getClients} />
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
            onSubmit={getClients}
          />
        )}
      </div>
      {clientSelected && <Detail client={clientSelected} />}
    </section>
  );
};

export default ClientsPage;
