"use client";
import styles from "./styles.module.scss";
import { ChangeEvent, useEffect, useState } from "react";
import Title from "@/components/Title";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Row from "./Row";
import LoadingSpinner from "@/components/Loading";
import { get, remove } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setClientsData } from "@/store/features/clients";
import { ClientsProps } from "@/typescript/interfaces/clients.interface";
import { useMessageToast } from "@/hooks/useMessageToast";
import addIcon from "../../../public/icons/add.svg";
import FormCreate from "./FormCreate";
import Detail from "./Detail";
import PopupConfirm from "@/components/PopupConfirm";
import Search from "./Search";

const ClientsPage = () => {
  const [clients, setClients] = useState<ClientsProps[]>([]);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [clientSelected, setClientSelected] = useState<ClientsProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopupCreate, setShowPopupCreate] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
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
  };

  return (
    <section className={styles.container}>
      <div className={styles.inner_container}>
        <Title text='Cartera de Clientes' />
        <Search setClients={setClients} />
        {loading ? (
          <LoadingSpinner />
        ) : clients.length > 0 ? (
          <div className={styles.clients}>
            {clients.map((client: ClientsProps) => (
              <Row
                key={client._id}
                client={client}
                onSelectClient={setClientSelected}
                onDelete={() => {
                  setShowPopupDelete(true), setClientId(client._id);
                }}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No hay clientes disponibles</p>
        )}
        <div className={styles.btn_container}>
          <Button
            title='Agregar cliente'
            styleName='btn_outline'
            onclick={() => setShowPopupCreate(true)}
            icon={addIcon}
          />
        </div>
        {showPopupCreate && (
          <FormCreate
            title='Información del cliente'
            buttonText='Confirmar'
            setShowPopup={setShowPopupCreate}
            onCancel={handleClose}
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
