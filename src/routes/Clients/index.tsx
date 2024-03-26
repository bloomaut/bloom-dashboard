"use client";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import Title from "@/components/Title";
import Button from "@/components/Button";
import { get, remove } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setClientsData } from "@/store/features/clients";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import addIcon from "../../../public/icons/add.svg";
import PopupActions from "./PopupActions";
import Detail from "./Detail";
import PopupConfirm from "@/components/PopupConfirm";
import Search from "./Search";
import List from "./List";

const ClientsPage = () => {
  const clients = useAppSelector(state => state.clients);
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [clientSelected, setClientSelected] = useState<ClientsProps | null>(null);
  const [filteredClients, setFilteredClients] = useState<ClientsProps[]>(clients);
  const dispatch = useAppDispatch();
  const { notify, notifyError } = useMessageToast();

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

  const handleDelete = async () => {
    try {
      if (clientId) {
        const data = await remove("client-customer", clientId, ENV.DASH);
        if (data.statusCode === 200) {
          setShowPopupDelete(false);
          setClientSelected(null);
          notify("Cliente eliminado correctamente");
          getClients();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setShowPopupCreate(false);
    setShowPopupDelete(false);
    setShowPopupEdit(false);
  };

  return (
    <section className={styles.container}>
      <div className={styles.inner_container}>
        <Title text='Cartera de Clientes' />
        <Search data={clients} setFilteredClients={setFilteredClients} />
        <List
          data={filteredClients}
          loading={loading}
          setClientSelected={setClientSelected}
          setShowPopupDelete={setShowPopupDelete}
          setShowPopupEdit={setShowPopupEdit}
          setClientId={setClientId}
        />
        <div className={styles.btn_container}>
          <Button
            title='Agregar cliente'
            styleName='btn_outline'
            onclick={() => setShowPopupCreate(true)}
            icon={addIcon}
          />
        </div>
        {showPopupCreate && (
          <PopupActions
            requestType='POST'
            title='Información del cliente'
            buttonText='Confirmar'
            setShowPopup={setShowPopupCreate}
            onCancel={handleClose}
            onSubmit={getClients}
          />
        )}
        {showPopupEdit && (
          <PopupActions
            requestType='PUT'
            clientId={clientId}
            title='Editar Cliente'
            buttonText='Confirmar'
            setShowPopup={setShowPopupEdit}
            onCancel={handleClose}
            onSubmit={getClients}
          />
        )}
        {showPopupDelete && (
          <PopupConfirm
            onConfirm={handleDelete}
            onCancel={handleClose}
            setShowConfirmation={setShowPopupDelete}
            title='¿Seguro que deseas eliminar este cliente?'
            textCancel='Cancelar'
            textAccept='Eliminar'
          />
        )}
      </div>
      {clientSelected && <Detail client={clientSelected} />}
    </section>
  );
};

export default ClientsPage;
